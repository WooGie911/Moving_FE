import React, { useState, useCallback, useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";
import { IFormState, TAddressType, IDaumAddress } from "@/types/estimateRequest";
import { formatDateByLanguage } from "@/utils/dateUtils";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";

// 세션 스토리지 키
const ESTIMATE_REQUEST_SESSION_KEY = "estimateRequest_draft";

// 초기 폼 상태
const initialForm: IFormState = {
  movingType: "small",
  movingDate: "",
  isDateConfirmed: false,
  departure: { roadAddress: "", detailAddress: "", zoneCode: "", jibunAddress: "", extraAddress: "" },
  arrival: { roadAddress: "", detailAddress: "", zoneCode: "", jibunAddress: "", extraAddress: "" },
};

// 세션에서 데이터 로드
const loadFromSession = (): Partial<IFormState> => {
  if (typeof window === "undefined") return {};

  try {
    const saved = localStorage.getItem(ESTIMATE_REQUEST_SESSION_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    console.error("세션 데이터 로드 실패:", error);
    return {};
  }
};

// 세션에 데이터 저장
const saveToSession = (data: IFormState) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(ESTIMATE_REQUEST_SESSION_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("세션 데이터 저장 실패:", error);
  }
};

// 세션 데이터 삭제
const clearSession = () => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(ESTIMATE_REQUEST_SESSION_KEY);
  } catch (error) {
    console.error("세션 데이터 삭제 실패:", error);
  }
};

export const useEstimateRequestForm = (initialData?: Partial<IFormState>) => {
  const [form, setForm] = useState<IFormState>(() => {
    // 세션에서 복원하거나 초기 데이터 사용
    const sessionData = loadFromSession();
    return {
      ...initialForm,
      ...sessionData,
      ...initialData,
    };
  });
  const [step, setStep] = useState(1);
  const [showNextQuestion, setShowNextQuestion] = useState(true);
  const [pendingAnswer, setPendingAnswer] = useState<string | undefined>(undefined);
  const { t, language } = useLanguageStore();

  const progress = step === 4 ? 100 : step * 33;

  // 폼 데이터가 변경될 때마다 세션에 저장
  useEffect(() => {
    saveToSession(form);
  }, [form]);

  // 폼 유효성 검사
  const isFormValid = useCallback(() => {
    return !!(form.movingType && form.movingDate && form.departure.roadAddress && form.arrival.roadAddress);
  }, [form]);

  // 이사 종류 선택 핸들러
  const handleSelectMovingType = useCallback((type: "small" | "home" | "office") => {
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

  // 세션 데이터 초기화
  const clearSessionData = useCallback(() => {
    clearSession();
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
        return `${t(`estimateRequest.movingTypes.${pendingAnswer}`)} (${t(`estimateRequest.movingTypes.${pendingAnswer}Desc`)})`;
      } else if (step === 2) {
        return formatDateByLanguage(pendingAnswer, language);
      }
      return pendingAnswer;
    },
    [t, language],
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
    handleAddressUpdate,
    clearSessionData,
    getAnswerText,
    handleEditMovingType,
    handleEditMovingDate,
    handleEditAddress,
    renderAnswerBubble,
    renderPreviousAnswers,
    t,
    locale: language,
  };
};
