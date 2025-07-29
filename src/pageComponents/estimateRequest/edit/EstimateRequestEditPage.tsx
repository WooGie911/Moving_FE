"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import { EstimateRequestLayout } from "@/components/estimateRequest/common/EstimateRequestLayout";
import { EstimateRequestStepRenderer } from "@/components/estimateRequest/common/EstimateRequestStepRenderer";
import { useEstimateRequestForm } from "@/hooks/useEstimateRequestForm";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useEstimateRequestAddressModal } from "@/hooks/useEstimateRequestAddressModal";
import { useLanguageStore } from "@/stores/languageStore";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import estimateRequestApi from "@/lib/api/estimateRequest.api";
import { IEstimateRequestResponse } from "@/types/estimateRequest";

const EstimateRequestEditPage = () => {
  const [estimateRequestData, setEstimateRequestData] = useState<IEstimateRequestResponse | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();
  const { t, language } = useLanguageStore();

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
    isFormValid,
    handleSelectMovingType,
    handleDateChange,
    handleDateComplete,
    handleEditStep,
    handleAddressUpdate,
    getAnswerText,
  } = formLogic;

  const { updateMutation, deleteMutation, showErrorModal } = apiLogic;

  // 주소 모달 훅 사용
  const { handleDepartureModal, handleArrivalModal } = useEstimateRequestAddressModal(handleAddressUpdate);

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
  const handleEdit = () => {
    if (!estimateRequestData) {
      showErrorModal(t("estimateRequest.noDataAvailable"));
      return;
    }

    // 기존 데이터로 폼 초기화
    setForm({
      movingType: estimateRequestData.movingType.toLowerCase() as "small" | "home" | "office",
      movingDate: estimateRequestData.movingDate,
      isDateConfirmed: true,
      departure: {
        roadAddress: estimateRequestData.departureAddress,
        detailAddress: estimateRequestData.departureDetailAddress || "",
        zonecode: "",
        jibunAddress: "",
        extraAddress: "",
      },
      arrival: {
        roadAddress: estimateRequestData.arrivalAddress,
        detailAddress: estimateRequestData.arrivalDetailAddress || "",
        zonecode: "",
        jibunAddress: "",
        extraAddress: "",
      },
    });

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
  const handleDeleteClick = () => {
    apiLogic.showDeleteConfirmModal(() => {
      deleteMutation.mutate();
    });
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
              ? `${t(`estimateRequest.movingTypes.${form.movingType}`)} (${t(`estimateRequest.movingTypes.${form.movingType}Desc`)})`
              : ""}
          </SpeechBubble>
        </div>,
      );
    }

    if (step > 2 && form.movingDate) {
      answers.push(
        <div key="movingDate" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={handleEditMovingDate}>
            {formatDateByLanguage(form.movingDate, language)}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  }, [step, form, t, language, handleEditMovingType, handleEditMovingDate]);

  // 로딩 상태
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">{t("common.loading")}</div>
        </div>
      </div>
    );
  }

  // 데이터 없음 상태
  if (!estimateRequestData) {
    return (
      <div className="min-h-screen bg-gray-200">
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-lg">{t("estimateRequest.noDataAvailable")}</div>
        </div>
      </div>
    );
  }

  // 이사 종류 라벨 변환
  const getMoveTypeLabel = (moveType: string): string => {
    switch (moveType) {
      case "HOME":
        return t("estimateRequest.movingTypes.home");
      case "OFFICE":
        return t("estimateRequest.movingTypes.office");
      case "SMALL":
        return t("estimateRequest.movingTypes.small");
      default:
        return moveType;
    }
  };

  // 날짜 변환
  const moveDateLabel = formatDateByLanguage(estimateRequestData.movingDate, language);

  // 주소 표시 (null 체크 포함)
  const departureDisplay = `${shortenRegionInAddress(estimateRequestData.departureAddress)}${estimateRequestData.departureDetailAddress ? ` ${estimateRequestData.departureDetailAddress}` : ""}`;
  const arrivalDisplay = `${shortenRegionInAddress(estimateRequestData.arrivalAddress)}${estimateRequestData.arrivalDetailAddress ? ` ${estimateRequestData.arrivalDetailAddress}` : ""}`;

  // edit 모드일 때 create와 동일한 질문 플로우 렌더링
  if (isEditMode) {
    return (
      <EstimateRequestLayout title={t("estimateRequest.editTitle")} progress={progress}>
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("estimateRequest.intro")}</SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("estimateRequest.movingTypeQuestion")}</SpeechBubble>
        </div>

        {/* 이전 답변들 */}
        {renderPreviousAnswers()}

        {/* 현재 답변 말풍선 */}
        {renderAnswerBubble()}

        {/* 현재 단계 */}
        <EstimateRequestStepRenderer
          step={step}
          showNextQuestion={showNextQuestion}
          form={form}
          t={t}
          locale={language}
          isFormValid={isFormValid}
          onSelectMovingType={handleSelectMovingType}
          onDateChange={handleDateChange}
          onDateComplete={handleDateComplete}
          onDepartureModal={handleDepartureModal}
          onArrivalModal={handleArrivalModal}
          onConfirmEstimateRequest={handleConfirmEdit}
          customButtonText={t("estimateRequest.editButton")}
          showConfirmModal={apiLogic.showUpdateConfirmModal}
        />
      </EstimateRequestLayout>
    );
  }

  // 일반 모드일 때 기존 견적 정보 표시
  return (
    <EstimateRequestLayout title={t("estimateRequest.editTitle")} progress={100}>
      {/* 기존 견적 정보 말풍선들 */}
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.movingType")}: {getMoveTypeLabel(estimateRequestData.movingType)}
        </SpeechBubble>
      </div>
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.movingDate")}: {moveDateLabel}
        </SpeechBubble>
      </div>
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.departure")}: {departureDisplay}
        </SpeechBubble>
      </div>
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={false}>
          {t("estimateRequest.result.arrival")}: {arrivalDisplay}
        </SpeechBubble>
      </div>

      {/* 수정/삭제 질문 말풍선 */}
      <div className="fade-in-up">
        <SpeechBubble type="question">
          <div className="flex min-w-[279px] flex-col gap-3 px-6 py-5">
            <p className="text-black-400">{t("estimateRequest.editQuestion")}</p>
            <div className="flex gap-3">
              <Button variant="outlined" width="flex-1" height="h-[54px]" rounded="rounded-[16px]" onClick={handleEdit}>
                {t("estimateRequest.editButton")}
              </Button>
              <Button
                variant="solid"
                width="flex-1"
                height="h-[54px]"
                rounded="rounded-[16px]"
                onClick={handleDeleteClick}
              >
                {t("estimateRequest.deleteButton")}
              </Button>
            </div>
          </div>
        </SpeechBubble>
      </div>
    </EstimateRequestLayout>
  );
};

export default EstimateRequestEditPage;
