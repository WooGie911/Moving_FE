"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import estimateRequestApi from "@/lib/api/estimateRequest.api";

// 분리된 섹션 컴포넌트들
import MovingTypeSection from "@/components/estimateRequest/create/sections/MovingTypeSection";
import DateSection from "@/components/estimateRequest/create/sections/DateSection";
import AddressModal from "@/components/estimateRequest/create/card/AddressModal";
import AddressSection from "@/components/estimateRequest/create/sections/AddressSection";

// 공통 스타일 변수
const EDIT_PAGE_STYLES = {
  container: "min-h-screen bg-gray-200",
  header: "sticky top-[72px] z-10 border-b border-gray-200 bg-white p-6 shadow-sm",
  title: "text-2lg text-black-400 leading-lg mb-4 font-semibold",
  content: "space-y-4 p-6",
  loadingContainer: "flex min-h-screen items-center justify-center",
  loadingText: "text-lg",
  errorContainer: "flex min-h-screen items-center justify-center",
  errorText: "text-lg",
  questionContainer: "flex min-w-[279px] flex-col gap-3 px-6 py-5",
  questionText: "text-black-400",
  buttonGroup: "flex gap-3",
  button: "h-[54px] rounded-[16px]",
  buttonFlex: "flex-1",
} as const;

// 견적 데이터 타입 정의 (실제 API 응답 구조에 맞춤)
interface EstimateRequestData {
  id: number;
  userId: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  departureAddress: string;
  arrivalAddress: string;
  departureDetailAddress: string | null;
  arrivalDetailAddress: string | null;
  movingDate: string;
  status: "ACTIVE" | "PENDING" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
}

const EstimateRequestEditPage = () => {
  const [estimateRequestData, setEstimateRequestData] = useState<EstimateRequestData | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [step, setStep] = useState(1);
  const [showNextQuestion, setShowNextQuestion] = useState(true);
  const [pendingAnswer, setPendingAnswer] = useState<string | undefined>(undefined);
  const router = useRouter();
  const { t, language } = useLanguageStore();
  const { open, close } = useModal();

  // 폼 상태
  const [form, setForm] = useState({
    movingType: "",
    movingDate: "",
    isDateConfirmed: false,
    departure: {
      roadAddress: "",
      detailAddress: "",
      zonecode: "",
      jibunAddress: "",
      extraAddress: "",
    },
    arrival: {
      roadAddress: "",
      detailAddress: "",
      zonecode: "",
      jibunAddress: "",
      extraAddress: "",
    },
  });

  // 활성 견적 데이터 로드 및 존재 여부 확인
  useEffect(() => {
    fetchEstimateRequestData();
  }, []);

  // 견적 존재 여부 확인 및 create 페이지로 리다이렉트
  const checkAndRedirectToCreate = async () => {
    try {
      console.log("=== 견적 요청 존재 여부 확인 ===");
      const response = await estimateRequestApi.getActive();
      console.log("확인 결과:", response);

      if (!response.success || !response.hasActive) {
        // 활성 견적이 없으면 create 페이지로 리다이렉트
        console.log("활성 견적이 없어 create 페이지로 리다이렉트");
        router.push("/estimateRequest/create");
        return;
      }

      // 활성 견적이 있으면 edit 페이지에서 계속 진행
      console.log("활성 견적이 존재하여 edit 페이지에서 계속 진행");
    } catch (error) {
      console.error("견적 존재 여부 확인 실패:", error);
      // 에러 발생 시 create 페이지로 리다이렉트
      router.push("/estimateRequest/create");
    }
  };

  const fetchEstimateRequestData = async () => {
    try {
      console.log("=== 견적 요청 조회 API 호출 ===");

      const response = await estimateRequestApi.getActive();
      console.log("API 응답:", response);

      if (response.success && response.hasActive && response.data) {
        setEstimateRequestData(response.data);
      } else if (response.success && !response.hasActive) {
        showErrorModal("활성 견적 요청이 없습니다.");
      } else {
        showErrorModal(response.message || "견적 데이터를 불러오는데 실패했습니다.");
      }
    } catch (error) {
      console.error("견적 데이터를 불러오는데 실패했습니다:", error);

      // API 응답에서 에러 메시지 추출
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          showErrorModal(errorData.message || "견적 데이터를 불러오는데 실패했습니다.");
        } catch {
          showErrorModal(error.message || "견적 데이터를 불러오는데 실패했습니다.");
        }
      } else {
        showErrorModal("견적 데이터를 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const showErrorModal = (message: string) => {
    open({
      title: t("common.error"),
      children: (
        <div className="p-6">
          <p className="mb-4 text-gray-700">{message}</p>
        </div>
      ),
      buttons: [
        {
          text: t("common.confirm"),
          onClick: () => {
            close();
            window.location.reload();
          },
        },
      ],
    });
  };

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    return !!(form.movingType && form.movingDate && form.departure.roadAddress && form.arrival.roadAddress);
  }, [form]);

  // 이사 종류 선택 핸들러
  const handleSelectMovingType = useCallback((type: string) => {
    setForm((prev) => ({ ...prev, movingType: type }));
    setPendingAnswer(type);
    setShowNextQuestion(false);
  }, []);

  // 날짜 변경 핸들러
  const handleDateChange = useCallback((date: string) => {
    setForm((prev) => ({ ...prev, movingDate: date }));
  }, []);

  // 날짜 완료 핸들러
  const handleDateComplete = useCallback(() => {
    setForm((prev) => ({ ...prev, isDateConfirmed: true }));
    setPendingAnswer(form.movingDate);
    setShowNextQuestion(false);
  }, [form.movingDate]);

  // 주소 모달 열기 핸들러
  const handleOpenAddressModal = useCallback(
    (type: "departure" | "arrival") => {
      open({
        title: t("estimateRequest.selectAddressTitle", { place: t(`estimateRequest.${type}`) }),
        children: (
          <AddressModal
            onComplete={(addr) => {
              setForm((prev) => ({
                ...prev,
                [type]: {
                  roadAddress: addr.roadAddress,
                  detailAddress: addr.detailAddress || "",
                  zonecode: addr.zonecode,
                  jibunAddress: addr.jibunAddress,
                  extraAddress: addr.extraAddress,
                },
              }));
              close();
            }}
            onClose={close}
          />
        ),
        buttons: [],
      });
    },
    [open, close, t, setForm],
  );

  // 주소 모달 핸들러들
  const handleDepartureModal = useCallback(() => handleOpenAddressModal("departure"), [handleOpenAddressModal]);
  const handleArrivalModal = useCallback(() => handleOpenAddressModal("arrival"), [handleOpenAddressModal]);

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
  }, [pendingAnswer, step]);

  // 수정하기 핸들러 - edit 모드로 전환하여 질문 플로우 시작
  const handleEdit = () => {
    if (!estimateRequestData) {
      alert("수정할 데이터가 없습니다.");
      return;
    }

    // 기존 데이터로 폼 초기화
    setForm({
      movingType: estimateRequestData.movingType.toLowerCase(),
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
    try {
      console.log("=== 견적 요청 수정 API 호출 ===");
      console.log("요청 데이터:", JSON.stringify(form, null, 2));

      const result = await estimateRequestApi.updateActive(form);
      console.log("수정 API 응답:", result);

      if (result.success) {
        alert("견적 요청이 성공적으로 수정되었습니다!");
        // 수정 완료 후 edit 모드 해제
        setIsEditMode(false);
        setStep(1);
        setShowNextQuestion(true);
        // 데이터 다시 로드
        fetchEstimateRequestData();
      } else {
        alert(result.message || "견적 요청 수정에 실패했습니다.");
      }
    } catch (error) {
      console.error("수정 에러:", error);

      // API 응답에서 에러 메시지 추출
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          alert(errorData.message || "수정에 실패했습니다.");
        } catch {
          alert(error.message || "수정에 실패했습니다.");
        }
      } else {
        alert("수정에 실패했습니다.");
      }
    }
  };

  // DELETE(삭제) API 연결 (모달 확인 시에만 삭제)
  const handleDeleteClick = () => {
    open({
      title: t("estimateRequest.deleteConfirmTitle"),
      children: (
        <div className="p-6">
          <p className="mb-4 text-gray-700">{t("estimateRequest.deleteConfirmMessage")}</p>
        </div>
      ),
      buttons: [
        {
          text: t("common.cancel"),
          onClick: close,
          variant: "outlined",
        },
        {
          text: t("common.delete"),
          variant: "solid",
          onClick: async () => {
            try {
              console.log("=== 견적 요청 삭제 API 호출 ===");

              const result = await estimateRequestApi.cancelActive();
              console.log("삭제 완료", result);

              close();
              if (result.success) {
                alert("견적 요청이 성공적으로 삭제되었습니다!");
              } else {
                alert(result.message || "견적 요청 삭제에 실패했습니다.");
              }
            } catch (error) {
              // API 응답에서 에러 메시지 추출
              if (error instanceof Error) {
                try {
                  const errorData = JSON.parse(error.message);
                  alert(errorData.message || "삭제에 실패했습니다.");
                } catch {
                  alert(error.message || "삭제에 실패했습니다.");
                }
              } else {
                alert("삭제에 실패했습니다.");
              }
              close();
            }
          },
        },
      ],
    });
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={EDIT_PAGE_STYLES.container}>
        <div className={EDIT_PAGE_STYLES.loadingContainer}>
          <div className={EDIT_PAGE_STYLES.loadingText}>로딩 중...</div>
        </div>
      </div>
    );
  }

  // 데이터 없음 상태
  if (!estimateRequestData) {
    return (
      <div className={EDIT_PAGE_STYLES.container}>
        <div className={EDIT_PAGE_STYLES.errorContainer}>
          <div className={EDIT_PAGE_STYLES.errorText}>견적 데이터를 불러올 수 없습니다.</div>
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
      <div className={EDIT_PAGE_STYLES.container}>
        <style jsx>{fadeInUpAnimation}</style>

        {/* 헤더 영역 */}
        <div className={EDIT_PAGE_STYLES.header}>
          <h2 className={EDIT_PAGE_STYLES.title}>견적 요청 수정</h2>
        </div>

        {/* 말풍선 영역 */}
        <div className={EDIT_PAGE_STYLES.content}>
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("estimateRequest.intro")}</SpeechBubble>
          </div>
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("estimateRequest.movingTypeQuestion")}</SpeechBubble>
          </div>

          {/* 이전 답변들 */}
          {step > 1 && form.movingType && (
            <div className="fade-in-up">
              <SpeechBubble type="answer" isLatest={false}>
                {form.movingType
                  ? `${t(`estimateRequest.movingTypes.${form.movingType}`)} (${t(`estimateRequest.movingTypes.${form.movingType}Desc`)})`
                  : ""}
              </SpeechBubble>
            </div>
          )}

          {step > 2 && form.movingDate && (
            <div className="fade-in-up">
              <SpeechBubble type="answer" isLatest={false}>
                {formatDateByLanguage(form.movingDate, language)}
              </SpeechBubble>
            </div>
          )}

          {/* 현재 답변 말풍선 */}
          {pendingAnswer && (
            <div className="fade-in-up">
              <SpeechBubble type="answer" isLatest={true}>
                {step === 1
                  ? `${t(`estimateRequest.movingTypes.${pendingAnswer}`)} (${t(`estimateRequest.movingTypes.${pendingAnswer}Desc`)})`
                  : formatDateByLanguage(pendingAnswer, language)}
              </SpeechBubble>
            </div>
          )}

          {/* 현재 단계 */}
          {showNextQuestion && (
            <>
              {step === 1 && (
                <div className="fade-in-up">
                  <MovingTypeSection value={form.movingType} onSelect={handleSelectMovingType} />
                </div>
              )}
              {step === 2 && (
                <div className="fade-in-up">
                  <SpeechBubble type="question">{t("estimateRequest.dateQuestion")}</SpeechBubble>
                  <SpeechBubble type="question">
                    <DateSection
                      value={form.movingDate}
                      onChange={handleDateChange}
                      onComplete={handleDateComplete}
                      className="mx-auto min-w-[327px] lg:max-w-160"
                    />
                  </SpeechBubble>
                </div>
              )}
              {step === 3 && (
                <div className="fade-in-up">
                  <SpeechBubble type="question">{t("estimateRequest.addressQuestion")}</SpeechBubble>
                  <SpeechBubble type="question">
                    <div className="flex min-w-[279px] flex-col gap-2 px-3 py-2">
                      <AddressSection label="departure" value={form.departure} onClick={handleDepartureModal} />
                      <AddressSection label="arrival" value={form.arrival} onClick={handleArrivalModal} />
                      <Button
                        variant="solid"
                        width="w-full"
                        height="h-[54px]"
                        rounded="rounded-[16px]"
                        fontSize="text-base"
                        onClick={handleConfirmEdit}
                      >
                        수정 완료
                      </Button>
                    </div>
                  </SpeechBubble>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  // 일반 모드일 때 기존 렌더링
  return (
    <div className={EDIT_PAGE_STYLES.container}>
      <style jsx>{fadeInUpAnimation}</style>

      {/* 헤더 영역 */}
      <div className={EDIT_PAGE_STYLES.header}>
        <h2 className={EDIT_PAGE_STYLES.title}>{t("estimateRequest.editTitle")}</h2>
      </div>

      {/* 말풍선 영역 */}
      <div className={EDIT_PAGE_STYLES.content}>
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
            <div className={EDIT_PAGE_STYLES.questionContainer}>
              <p className={EDIT_PAGE_STYLES.questionText}>{t("estimateRequest.editQuestion")}</p>
              <div className={EDIT_PAGE_STYLES.buttonGroup}>
                <Button
                  variant="outlined"
                  width={EDIT_PAGE_STYLES.buttonFlex}
                  height={EDIT_PAGE_STYLES.button}
                  rounded="rounded-[16px]"
                  onClick={handleEdit}
                >
                  {t("estimateRequest.editButton")}
                </Button>
                <Button
                  variant="solid"
                  width={EDIT_PAGE_STYLES.buttonFlex}
                  height={EDIT_PAGE_STYLES.button}
                  rounded="rounded-[16px]"
                  onClick={handleDeleteClick}
                >
                  {t("estimateRequest.deleteButton")}
                </Button>
              </div>
            </div>
          </SpeechBubble>
        </div>
      </div>
    </div>
  );
};

export default EstimateRequestEditPage;
