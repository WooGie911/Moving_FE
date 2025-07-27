"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "@/components/estimateRequest/create/ProgressBar";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import AddressModal from "@/components/estimateRequest/create/card/AddressModal";
import { useModal } from "@/components/common/modal/ModalContext";

// 분리된 섹션 컴포넌트들
import MovingTypeSection from "@/components/estimateRequest/create/sections/MovingTypeSection";
import DateSection from "@/components/estimateRequest/create/sections/DateSection";
import AddressSection from "@/components/estimateRequest/create/sections/AddressSection";

// 타입과 상수
import { IFormState, TAddressType } from "@/types/estimateRequest";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useLanguageStore } from "@/stores/languageStore";

import estimateRequestApi from "@/lib/api/estimateRequest.api";

// 공통 스타일 변수
const PAGE_STYLES = {
  container: "min-h-screen bg-gray-200",
  header: "sticky top-[72px] z-10  bg-white p-6 shadow-sm",
  headerContent: "mx-auto min-w-[330px] md:min-w-175 lg:max-w-225",
  title: "text-2lg text-black-400 leading-lg mb-4 font-semibold",
  content: "mx-auto min-w-[330px] space-y-4 py-6 md:min-w-175 lg:max-w-225",
  button: "h-[54px] rounded-[16px]",
  buttonFull: "w-full",
  buttonFlex: "flex-1",
  buttonGroup: "flex gap-3",
  addressContainer: "flex min-w-[279px] flex-col gap-2 px-3 py-2",
  questionContainer: "flex min-w-[279px] flex-col gap-3 px-3 py-2",
  questionText: "text-black-400",
  resultContainer: "space-y-2",
  resultItem: "text-base leading-6",
} as const;

// 초기 상태
const initialForm: IFormState = {
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
};

// 커스텀 훅: 견적 요청 폼 로직
const useEstimateRequestForm = () => {
  const [form, setForm] = useState<IFormState>(initialForm);
  const [step, setStep] = useState(1);
  const [showNextQuestion, setShowNextQuestion] = useState(true);
  const [pendingAnswer, setPendingAnswer] = useState<string | undefined>(undefined);
  const { t, language } = useLanguageStore();

  const progress = step === 4 ? 100 : step * 33;

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

  // 단계 수정 핸들러
  const handleEditStep = useCallback((targetStep: number) => {
    setStep(targetStep);
    setShowNextQuestion(true);
    setPendingAnswer(undefined);
  }, []);

  return {
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
    t,
    language,
  };
};

// 커스텀 훅: 견적 요청 API 로직
const useEstimateRequestApi = () => {
  const { open, close } = useModal();
  const { t } = useLanguageStore();
  const router = useRouter();

  // 에러 모달 표시
  const showErrorModal = useCallback(
    (message: string) => {
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
            onClick: close,
          },
        ],
      });
    },
    [open, close, t],
  );

  // 성공 모달 표시
  const showSuccessModal = useCallback(
    (message: string) => {
      open({
        title: "완료",
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{message}</p>
          </div>
        ),
        buttons: [
          {
            text: t("common.confirm"),
            onClick: close,
          },
        ],
      });
    },
    [open, close, t],
  );

  // 견적 확정 핸들러
  const handleConfirmEstimateRequest = useCallback(
    async (form: IFormState) => {
      try {
        console.log("=== 견적 요청 생성 API 호출 ===");
        console.log("요청 데이터:", JSON.stringify(form, null, 2));

        const result = await estimateRequestApi.create(form);
        console.log("API 응답:", result);

        if (result.success) {
          showSuccessModal("견적 요청이 성공적으로 생성되었습니다!");
          // 견적 요청 완료 후 edit 페이지로 이동
          setTimeout(() => {
            router.push("/estimateRequest/edit");
          }, 1500);
        } else {
          showErrorModal(result.message || "견적 요청 생성에 실패했습니다.");
        }
      } catch (error) {
        console.error("견적 저장에 실패했습니다:", error);

        // API 응답에서 에러 메시지 추출
        if (error instanceof Error) {
          try {
            const errorData = JSON.parse(error.message);
            showErrorModal(errorData.message || "견적 저장에 실패했습니다.");
          } catch {
            showErrorModal(error.message || "견적 저장에 실패했습니다.");
          }
        } else {
          showErrorModal("견적 저장에 실패했습니다.");
        }
      }
    },
    [showErrorModal, showSuccessModal, router],
  );

  // 견적 삭제 핸들러
  const handleDelete = useCallback(() => {
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
          variant: "outlined",
          onClick: close,
        },
        {
          text: t("common.delete"),
          onClick: async () => {
            try {
              console.log("=== 견적 요청 삭제 API 호출 ===");

              const result = await estimateRequestApi.cancelActive();
              console.log("삭제 완료", result);

              close();
              if (result.success) {
                showSuccessModal("견적 요청이 성공적으로 삭제되었습니다!");
              } else {
                showErrorModal(result.message || "견적 요청 삭제에 실패했습니다.");
              }
            } catch (error) {
              console.error("견적 삭제에 실패했습니다:", error);

              // API 응답에서 에러 메시지 추출
              if (error instanceof Error) {
                try {
                  const errorData = JSON.parse(error.message);
                  showErrorModal(errorData.message || "견적 삭제에 실패했습니다.");
                } catch {
                  showErrorModal(error.message || "견적 삭제에 실패했습니다.");
                }
              } else {
                showErrorModal("견적 삭제에 실패했습니다.");
              }
            }
          },
        },
      ],
    });
  }, [open, close, t, showErrorModal]);

  return {
    showErrorModal,
    showSuccessModal,
    handleConfirmEstimateRequest,
    handleDelete,
    open,
    close,
  };
};

const EstimateRequestCreatePage = () => {
  const router = useRouter();
  const formLogic = useEstimateRequestForm();
  const apiLogic = useEstimateRequestApi();
  const { open, close } = apiLogic;

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
    t,
    language,
  } = formLogic;

  // 견적 존재 여부 확인 및 자동 분기
  useEffect(() => {
    checkAndRedirectToEdit();
  }, []);

  // 견적 존재 여부 확인 및 edit 페이지로 리다이렉트
  const checkAndRedirectToEdit = async () => {
    try {
      console.log("=== 견적 요청 존재 여부 확인 ===");
      const response = await estimateRequestApi.getActive();
      console.log("확인 결과:", response);

      if (response.success && response.hasActive) {
        // 활성 견적이 있으면 edit 페이지로 리다이렉트
        console.log("활성 견적이 존재하여 edit 페이지로 리다이렉트");
        router.push("/estimateRequest/edit");
        return;
      }

      // 활성 견적이 없으면 create 페이지에서 계속 진행
      console.log("활성 견적이 없어 create 페이지에서 계속 진행");
    } catch (error) {
      console.error("견적 존재 여부 확인 실패:", error);
      // 에러 발생 시 create 페이지에서 계속 진행
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
  }, [pendingAnswer, step]);

  // 주소 모달 열기 핸들러
  const handleOpenAddressModal = useCallback(
    (type: TAddressType) => {
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

  // 편집 핸들러들
  const handleEditMovingType = useCallback(() => handleEditStep(1), [handleEditStep]);
  const handleEditMovingDate = useCallback(() => handleEditStep(2), [handleEditStep]);
  const handleEditAddress = useCallback(() => handleEditStep(3), [handleEditStep]);

  // 삭제 핸들러
  const handleDelete = useCallback(async () => {
    try {
      await estimateRequestApi.cancelActive();
      router.push("/estimateRequest");
    } catch (error) {
      console.error("견적 요청 취소 실패:", error);
    }
  }, [router]);

  // 답변 말풍선 렌더링
  const renderAnswerBubble = useCallback(() => {
    if (!pendingAnswer) return undefined;

    let answerText = "";
    if (step === 1) {
      answerText = `${t(`estimateRequest.movingTypes.${pendingAnswer}`)} (${t(`estimateRequest.movingTypes.${pendingAnswer}Desc`)})`;
    } else if (step === 2) {
      answerText = formatDateByLanguage(pendingAnswer, language);
    }

    return (
      <div className="fade-in-up">
        <SpeechBubble type="answer" isLatest={true}>
          {answerText}
        </SpeechBubble>
      </div>
    );
  }, [pendingAnswer, step, t, language]);

  // 단계별 렌더링 함수
  const renderStep = useCallback(() => {
    if (!showNextQuestion) return undefined;

    switch (step) {
      case 1:
        return (
          <div className="fade-in-up">
            <MovingTypeSection value={form.movingType} onSelect={handleSelectMovingType} />
          </div>
        );
      case 2:
        return (
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
        );
      case 3:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("estimateRequest.addressQuestion")}</SpeechBubble>
            <SpeechBubble type="question">
              <div className={PAGE_STYLES.addressContainer}>
                <AddressSection label="departure" value={form.departure} onClick={() => handleDepartureModal()} />
                <AddressSection label="arrival" value={form.arrival} onClick={() => handleArrivalModal()} />
                <Button
                  variant="solid"
                  width={PAGE_STYLES.buttonFull}
                  height={PAGE_STYLES.button}
                  rounded="rounded-[16px]"
                  fontSize="text-base"
                  onClick={() => {
                    open({
                      title: t("estimateRequest.confirmTitle"),
                      children: (
                        <div className="p-6">
                          <p className="mb-4 text-gray-700">{t("estimateRequest.confirmMessage")}</p>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div>
                              {t("estimateRequest.result.movingType")}:{" "}
                              {t(`estimateRequest.movingTypes.${form.movingType}`)}
                            </div>
                            <div>
                              {t("estimateRequest.result.movingDate")}:{" "}
                              {formatDateByLanguage(form.movingDate, language)}
                            </div>
                            <div>
                              {t("estimateRequest.result.departure")}:{" "}
                              {shortenRegionInAddress(form.departure.roadAddress)} {form.departure.detailAddress}
                            </div>
                            <div>
                              {t("estimateRequest.result.arrival")}: {shortenRegionInAddress(form.arrival.roadAddress)}{" "}
                              {form.arrival.detailAddress}
                            </div>
                          </div>
                        </div>
                      ),
                      buttons: [
                        {
                          text: t("common.cancel"),
                          onClick: close,
                          variant: "outlined",
                        },
                        {
                          text: t("estimateRequest.confirmEstimateRequest"),
                          onClick: () => {
                            close();
                            apiLogic.handleConfirmEstimateRequest(form);
                          },
                        },
                      ],
                    });
                  }}
                >
                  견적 요청
                </Button>
              </div>
            </SpeechBubble>
          </div>
        );
      case 4:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="answer" isLatest={true}>
              <div className={PAGE_STYLES.resultContainer}>
                <div className={PAGE_STYLES.resultItem}>
                  {t("estimateRequest.result.movingType")}:{" "}
                  {form.movingType
                    ? `${t(`estimateRequest.movingTypes.${form.movingType}`)} (${t(`estimateRequest.movingTypes.${form.movingType}Desc`)})`
                    : ""}
                </div>
                <div className={PAGE_STYLES.resultItem}>
                  {t("estimateRequest.result.movingDate")}: {formatDateByLanguage(form.movingDate, language)}
                </div>
                <div className={PAGE_STYLES.resultItem}>
                  {t("estimateRequest.result.departure")}: {shortenRegionInAddress(form.departure.roadAddress)}{" "}
                  {form.departure.detailAddress}
                </div>
                <div className={PAGE_STYLES.resultItem}>
                  {t("estimateRequest.result.arrival")}: {shortenRegionInAddress(form.arrival.roadAddress)}{" "}
                  {form.arrival.detailAddress}
                </div>
              </div>
            </SpeechBubble>
            {isFormValid() && (
              <SpeechBubble type="question">
                <div className={PAGE_STYLES.questionContainer}>
                  <p className={PAGE_STYLES.questionText}>{t("estimateRequest.confirmQuestion")}</p>
                  <Button
                    variant="solid"
                    width={PAGE_STYLES.buttonFull}
                    height={PAGE_STYLES.button}
                    rounded="rounded-[16px]"
                    onClick={() => apiLogic.handleConfirmEstimateRequest(form)}
                  >
                    {t("estimateRequest.confirmEstimateRequest")}
                  </Button>
                </div>
              </SpeechBubble>
            )}
          </div>
        );
      default:
        return undefined;
    }
  }, [
    showNextQuestion,
    step,
    form,
    t,
    language,
    isFormValid,
    handleSelectMovingType,
    handleDateChange,
    handleDateComplete,
    handleDepartureModal,
    handleArrivalModal,
    apiLogic,
  ]);

  // 이전 답변들 렌더링
  const renderPreviousAnswers = useCallback(() => {
    const answers = [];

    if (step > 1 && form.movingType) {
      answers.push(
        <div key="movingType" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditMovingType()}>
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
          <SpeechBubble type="answer" isLatest={false} onEdit={() => handleEditMovingDate()}>
            {formatDateByLanguage(form.movingDate, language)}
          </SpeechBubble>
        </div>,
      );
    }

    if (step === 4 && form.departure.roadAddress) {
      answers.push(
        <div key="departure" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("estimateRequest.result.departure")}: {shortenRegionInAddress(form.departure.roadAddress)}{" "}
            {form.departure.detailAddress}
          </SpeechBubble>
        </div>,
      );
    }

    if (step === 4 && form.arrival.roadAddress) {
      answers.push(
        <div key="arrival" className="fade-in-up">
          <SpeechBubble type="answer" isLatest={false}>
            {t("estimateRequest.result.arrival")}: {shortenRegionInAddress(form.arrival.roadAddress)}{" "}
            {form.arrival.detailAddress}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  }, [step, form, t, language, handleEditMovingType, handleEditMovingDate, handleEditAddress]);

  return (
    <div className={PAGE_STYLES.container}>
      <style jsx>{fadeInUpAnimation}</style>

      {/* 상태바 영역 */}
      <div className={PAGE_STYLES.header}>
        <div className={PAGE_STYLES.headerContent}>
          <h2 className={PAGE_STYLES.title}>{t("estimateRequest.title")}</h2>
          <ProgressBar value={progress} />
        </div>
      </div>

      {/* 말풍선 영역 */}
      <div className={PAGE_STYLES.content}>
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
        {renderStep()}
      </div>
    </div>
  );
};

export default EstimateRequestCreatePage;
