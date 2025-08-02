"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import { EstimateRequestLayout } from "@/components/estimateRequest/common/EstimateRequestLayout";
import { useEstimateRequestForm } from "@/hooks/useEstimateRequestForm";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useTranslations, useLocale } from "next-intl";
import { formatDateByLanguage } from "@/utils/dateUtils";
import estimateRequestApi from "@/lib/api/estimateRequest.api";
import { IEstimateRequestResponse } from "@/types/estimateRequest";

import { EstimateRequestFlow } from "@/components/estimateRequest/common/EstimateRequestFlow";

const EstimateRequestEditPage = () => {
  const [estimateRequestData, setEstimateRequestData] = useState<IEstimateRequestResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasEstimates, setHasEstimates] = useState(false);
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  // 공통 훅들 사용
  const formLogic = useEstimateRequestForm();
  const apiLogic = useEstimateRequestApi();

  const {
    form,
    setForm,
    step,
    setStep,
    showNextQuestion,
    setShowNextQuestion,
    pendingAnswer,
    setPendingAnswer,
    progress,
    handleEditStep,
    handleAddressUpdate,
    getAnswerText,
  } = formLogic;

  const { updateMutation, deleteMutation, showErrorModal } = apiLogic;

  // 견적 데이터로 폼을 초기화하는 공통 함수
  const initializeFormFromData = useCallback(
    (data: IEstimateRequestResponse) => {
      setForm({
        movingType: data.movingType.toLowerCase() as "small" | "home" | "office",
        movingDate: data.movingDate,
        isDateConfirmed: true,
        departure: {
          roadAddress: data.departureAddress,
          detailAddress: data.departureDetailAddress || "",
          zoneCode: "",
          jibunAddress: "",
          extraAddress: "",
        },
        arrival: {
          roadAddress: data.arrivalAddress,
          detailAddress: data.arrivalDetailAddress || "",
          zoneCode: "",
          jibunAddress: "",
          extraAddress: "",
        },
      });
    },
    [setForm],
  );

  // 활성 견적 데이터 로드 및 존재 여부 확인
  useEffect(() => {
    fetchEstimateRequestData();
  }, []);

  // 견적 존재 여부 확인 및 create 페이지로 리다이렉트
  const checkAndRedirectToCreate = async () => {
    try {
      const response = await estimateRequestApi.getActive();

      if (!response.success || !response.hasActive) {
        // 활성 견적이 없으면 create 페이지로 리다이렉트
        router.push("/estimateRequest/create");
        return;
      }

      // 활성 견적이 있으면 edit 페이지에서 계속 진행
    } catch (error) {
      // 에러 발생 시 create 페이지로 리다이렉트
      router.push("/estimateRequest/create");
    }
  };

  const fetchEstimateRequestData = async () => {
    try {
      const response = await estimateRequestApi.getActive();

      if (response.success && response.hasActive && response.data) {
        setEstimateRequestData(response.data);
        setHasEstimates(response.hasEstimate || false);
        initializeFormFromData(response.data);
      } else if (response.success && !response.hasActive) {
        showErrorModal(t("estimateRequest.noActiveEstimateRequest"));
      } else {
        showErrorModal(response.message || t("estimateRequest.failedToLoadEstimateData"));
      }
    } catch (error) {
      console.error("견적 데이터를 불러오는데 실패했습니다:", error);

      // API 응답에서 에러 메시지 추출
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          showErrorModal(errorData.message || t("estimateRequest.failedToLoadEstimateData"));
        } catch {
          showErrorModal(error.message || t("estimateRequest.failedToLoadEstimateData"));
        }
      } else {
        showErrorModal(t("estimateRequest.failedToLoadEstimateData"));
      }
    } finally {
      setLoading(false);
    }
  };

  // 답변 후 다음 질문 표시를 위한 타이머
  useEffect(() => {
    if (pendingAnswer) {
      const timer = setTimeout(() => {
        setShowNextQuestion(true);
        setPendingAnswer(undefined);
        if (step === 1) {
          setStep(2);
        } else if (step === 2) {
          setStep(3);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pendingAnswer, step, setShowNextQuestion, setPendingAnswer, setStep]);

  // 수정하기 핸들러 - edit 모드로 전환하여 질문 플로우 시작
  const handleEdit = async () => {
    if (!estimateRequestData) {
      showErrorModal(t("estimateRequest.noDataAvailable"));
      return;
    }

    // 기사님이 보낸 견적이 있는지 확인
    if (hasEstimates) {
      router.push("/estimateRequest/pending");
      return;
    }

    // 기존 데이터로 폼 초기화
    initializeFormFromData(estimateRequestData);

    // edit 모드로 전환하고 첫 번째 질문부터 시작
    setIsEditMode(true);
    setStep(1);
    setShowNextQuestion(true);
  };

  // 수정 완료 핸들러
  const handleConfirmEdit = async () => {
    apiLogic.showUpdateConfirmModal(() => {
      updateMutation.mutate(form);
    });
  };

  // 삭제 핸들러
  const handleDeleteClick = async () => {
    // 기사님이 보낸 견적이 있는지 확인
    if (hasEstimates) {
      router.push("/estimateRequest/pending");
      return;
    }

    apiLogic.showDeleteConfirmModal(() => {
      deleteMutation.mutate();
    });
  };

  // 보러가기 핸들러
  const handleViewEstimates = () => {
    router.push("/estimateRequest/pending");
  };

  // 편집 핸들러들
  const handleEditMovingType = useCallback(() => {
    apiLogic.showEditItemConfirmModal(() => {
      handleEditStep(1);
    });
  }, [apiLogic, handleEditStep]);

  const handleEditMovingDate = useCallback(() => {
    apiLogic.showEditItemConfirmModal(() => {
      handleEditStep(2);
    });
  }, [apiLogic, handleEditStep]);

  // 답변 말풍선 렌더링
  const renderAnswerBubble = useCallback(() => {
    if (!pendingAnswer) return undefined;

    const answerText = getAnswerText(step, pendingAnswer);

    return (
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={true}>
          {answerText}
        </SpeechBubble>
      </div>
    );
  }, [pendingAnswer, step, getAnswerText]);

  // 이전 답변들 렌더링
  const renderPreviousAnswers = useCallback(() => {
    const answers = [];

    if (step > 1 && form.movingType) {
      answers.push(
        <div key="movingType" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={handleEditMovingType}>
            {form.movingType
              ? `${t(`shared.movingTypes.${form.movingType}`)} (${t(`shared.movingTypes.${form.movingType}Desc`)})`
              : ""}
          </SpeechBubble>
        </div>,
      );
    }

    if (step > 2 && form.movingDate) {
      answers.push(
        <div key="movingDate" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={handleEditMovingDate}>
            {formatDateByLanguage(form.movingDate, locale)}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  }, [step, form, t, locale, handleEditMovingType, handleEditMovingDate]);

  // 로딩 상태 - 전역 로딩이 표시되므로 별도 UI 불필요
  if (loading) {
    return null;
  }

  // 데이터 없음 상태
  if (!estimateRequestData) {
    return (
      <main className="min-h-screen bg-gray-200" role="main" aria-label="견적 요청 편집 페이지">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg" role="status" aria-live="polite">
            {t("estimateRequest.noDataAvailable")}
          </div>
        </div>
      </main>
    );
  }

  // 이사 종류 라벨 변환
  const getMoveTypeLabel = (moveType: string): string => {
    switch (moveType) {
      case "HOME":
        return t("shared.movingTypes.home");
      case "OFFICE":
        return t("shared.movingTypes.office");
      case "SMALL":
        return t("shared.movingTypes.small");
      default:
        return moveType;
    }
  };

  // 날짜 변환
  const moveDateLabel = formatDateByLanguage(estimateRequestData.movingDate, locale);

  // 주소 표시 (null 체크 포함)
  const departureDisplay = `${estimateRequestData.departureAddress}${estimateRequestData.departureDetailAddress ? ` ${estimateRequestData.departureDetailAddress}` : ""}`;
  const arrivalDisplay = `${estimateRequestData.arrivalAddress}${estimateRequestData.arrivalDetailAddress ? ` ${estimateRequestData.arrivalDetailAddress}` : ""}`;

  // edit 모드일 때 공통 컴포넌트 사용
  if (isEditMode) {
    return (
      <EstimateRequestFlow
        title={t("estimateRequest.editTitle")}
        onConfirm={(form: any) => updateMutation.mutate(form)}
        customButtonText={t("estimateRequest.editButton")}
        showConfirmModal={apiLogic.showUpdateConfirmModal}
      />
    );
  }

  // 일반 모드일 때 기존 견적 정보 표시
  return (
    <EstimateRequestLayout title={t("estimateRequest.editTitle")} progress={100}>
      {/* 기존 견적 정보 말풍선들 */}
      <section className="fade-in-up" role="region" aria-label="견적 요청 정보">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.movingType")}: {getMoveTypeLabel(estimateRequestData.movingType)}
        </SpeechBubble>
      </section>
      <section className="fade-in-up" role="region" aria-label="견적 요청 정보">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.movingDate")}: {moveDateLabel}
        </SpeechBubble>
      </section>
      <section className="fade-in-up" role="region" aria-label="견적 요청 정보">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.departure")}: {departureDisplay}
        </SpeechBubble>
      </section>
      <section className="fade-in-up" role="region" aria-label="견적 요청 정보">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.arrival")}: {arrivalDisplay}
        </SpeechBubble>
      </section>

      {/* 기사님이 보낸 견적이 있는 경우와 없는 경우 분기 처리 */}
      {hasEstimates ? (
        // 기사님이 보낸 견적이 있는 경우 - 보러가기 버튼
        <section className="fade-in-up" role="region" aria-label="견적 확인">
          <SpeechBubble type="question">
            <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
              <p className="text-black-400">{t("estimateRequest.hasEstimatesMessage")}</p>
              <div className="flex gap-3">
                <Button
                  variant="solid"
                  width="w-full"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handleViewEstimates}
                  aria-label="견적 보러가기"
                >
                  {t("estimateRequest.viewEstimatesButton")}
                </Button>
              </div>
            </div>
          </SpeechBubble>
        </section>
      ) : (
        // 기사님이 보낸 견적이 없는 경우 - 수정/삭제 버튼
        <section className="fade-in-up" role="region" aria-label="견적 요청 수정 또는 삭제">
          <SpeechBubble type="question">
            <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
              <p className="text-black-400">{t("estimateRequest.editQuestion")}</p>
              <div className="flex gap-3">
                <Button
                  variant="outlined"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handleEdit}
                  aria-label="견적 요청 수정하기"
                >
                  {t("estimateRequest.editButton")}
                </Button>
                <Button
                  variant="solid"
                  width="flex-1"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  onClick={handleDeleteClick}
                  aria-label="견적 요청 삭제하기"
                >
                  {t("estimateRequest.deleteButton")}
                </Button>
              </div>
            </div>
          </SpeechBubble>
        </section>
      )}
    </EstimateRequestLayout>
  );
};

export default EstimateRequestEditPage;
