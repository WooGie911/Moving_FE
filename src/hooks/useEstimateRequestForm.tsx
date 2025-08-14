import React, { useState, useCallback, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { IFormState, TAddressType, IDaumAddress } from "@/types/estimateRequest";
import { formatDateByLanguage } from "@/utils/dateUtils";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";

// 초기 폼 상태
const initialForm: IFormState = {
  movingType: "",
  movingDate: "",
  isDateConfirmed: false,
  departure: { roadAddress: "", detailAddress: "", zoneCode: "", jibunAddress: "", extraAddress: "" },
  arrival: { roadAddress: "", detailAddress: "", zoneCode: "", jibunAddress: "", extraAddress: "" },
};

export const useEstimateRequestForm = (initialData?: Partial<IFormState>) => {
  const [form, setForm] = useState<IFormState>(() => {
    // 초기 데이터만 사용
    return {
      ...initialForm,
      ...initialData,
    };
  });
  const [step, setStep] = useState(1);
  const [showNextQuestion, setShowNextQuestion] = useState(true);
  const [pendingAnswer, setPendingAnswer] = useState<string | undefined>(undefined);
  const t = useTranslations();
  const locale = useLocale();

  const progress = step === 4 ? 100 : step * 33;

  // 변경 여부(dirty) 판단
  const isDirty = React.useMemo(() => {
    const hasMoving = !!form.movingType || !!form.movingDate;
    const hasDeparture = !!form.departure.roadAddress || !!form.departure.detailAddress;
    const hasArrival = !!form.arrival.roadAddress || !!form.arrival.detailAddress;
    return hasMoving || hasDeparture || hasArrival;
  }, [form]);

  // 과거에 사용하던 견적요청 드래프트 로컬스토리지 키를 더 이상 사용하지 않도록 초기화 시 제거
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("estimateRequest_draft");
      }
    } catch {
      // ignore
    }
  }, []);

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    return !!(form.movingType && form.movingDate && form.departure.roadAddress && form.arrival.roadAddress);
  }, [form]);

  // 이사 종류 선택 핸들러
  const handleSelectMovingType = useCallback((type: "" | "small" | "home" | "office") => {
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

  // 주소 업데이트 핸들러
  const handleAddressUpdate = useCallback(
    (type: TAddressType, address: IDaumAddress) => {
      setForm((prev) => ({
        ...prev,
        [type]: {
          roadAddress: address.roadAddress,
          detailAddress: address.detailAddress || "",
          zoneCode: address.zoneCode,
          jibunAddress: address.jibunAddress,
          extraAddress: address.extraAddress,
        },
      }));
    },
    [setForm],
  );

  // 폼 데이터 초기화
  const clearFormData = useCallback(() => {
    setForm(initialForm);
    setStep(1);
    setShowNextQuestion(true);
    setPendingAnswer(undefined);
  }, []);

  // 답변 텍스트 생성
  const getAnswerText = useCallback(
    (step: number, pendingAnswer: string | undefined) => {
      if (!pendingAnswer) return "";

      if (step === 1) {
        return `${t(`shared.movingTypes.${pendingAnswer}`)} (${t(`shared.movingTypes.${pendingAnswer}Desc`)})`;
      } else if (step === 2) {
        return formatDateByLanguage(pendingAnswer, locale as "ko" | "en" | "zh");
      }
      return pendingAnswer;
    },
    [t, locale],
  );

  // 편집 핸들러들
  const handleEditMovingType = useCallback(() => handleEditStep(1), [handleEditStep]);
  const handleEditMovingDate = useCallback(() => handleEditStep(2), [handleEditStep]);
  const handleEditAddress = useCallback(() => handleEditStep(3), [handleEditStep]);

  // 답변 말풍선 렌더링
  const renderAnswerBubble = useCallback(() => {
    if (!pendingAnswer) return undefined;

    const answerText = getAnswerText(step, pendingAnswer);

    return (
      <div>
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
        <div key="movingType">
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
        <div key="movingDate">
          <SpeechBubble type="answer" isLatest={false} onEdit={handleEditMovingDate}>
            {formatDateByLanguage(form.movingDate, locale as "ko" | "en" | "zh")}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  }, [step, form, t, locale, handleEditMovingType, handleEditMovingDate]);

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
    isDirty,
    isFormValid,
    handleSelectMovingType,
    handleDateChange,
    handleDateComplete,
    handleEditStep,
    handleAddressUpdate,
    clearFormData,
    getAnswerText,
    handleEditMovingType,
    handleEditMovingDate,
    handleEditAddress,
    renderAnswerBubble,
    renderPreviousAnswers,
    t,
    locale,
  };
};
