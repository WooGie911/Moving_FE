"use client";

import React, { useState, useCallback, useEffect } from "react";
import ProgressBar from "@/components/quote/create/ProgressBar";
import SpeechBubble from "@/components/quote/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import AddressModal from "@/components/quote/create/card/AddressModal";
import { useModal } from "@/components/common/modal/ModalContext";

// 분리된 섹션 컴포넌트들
import MovingTypeSection from "@/components/quote/create/sections/MovingTypeSection";
import DateSection from "@/components/quote/create/sections/DateSection";
import AddressSection from "@/components/quote/create/sections/AddressSection";

// 타입과 상수
import { IFormState, TAddressType } from "@/types/quote";
import { fadeInUpAnimation } from "@/constant/quoteStyles";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { useLanguageStore } from "@/stores/languageStore";

// 초기 상태
const initialForm: IFormState = {
  movingType: "",
  movingDate: "",
  isDateConfirmed: false,
  departure: { roadAddress: "", detailAddress: "" },
  arrival: { roadAddress: "", detailAddress: "" },
};

const QuoteCreatePage = () => {
  const [form, setForm] = useState<IFormState>(initialForm);
  const [step, setStep] = useState(1); // 1:이사종류, 2:날짜, 3:주소, 4:확정
  const [showNextQuestion, setShowNextQuestion] = useState(true); // 초기에는 첫 번째 질문을 보여줌
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const { open, close } = useModal();
  const { t, language } = useLanguageStore();

  const progress = step === 4 ? 100 : step * 33;

  // 답변 후 다음 질문 표시를 위한 타이머
  useEffect(() => {
    if (pendingAnswer) {
      const timer = setTimeout(() => {
        setShowNextQuestion(true);
        setPendingAnswer(null);
        // 다음 단계로 진행
        if (step === 1) {
          setStep(2);
        } else if (step === 2) {
          setStep(3);
        }
      }, 1500); // 1.5초 후 다음 질문 표시

      return () => clearTimeout(timer);
    }
  }, [pendingAnswer, step]);

  // 핸들러 함수들
  const handleSelectMovingType = useCallback((type: string) => {
    setForm((prev) => ({ ...prev, movingType: type }));
    setPendingAnswer(type);
    setShowNextQuestion(false);
  }, []);

  const handleDateChange = useCallback((date: string) => {
    setForm((prev) => ({ ...prev, movingDate: date }));
  }, []);

  const handleDateComplete = useCallback(() => {
    setForm((prev) => ({ ...prev, isDateConfirmed: true }));
    setPendingAnswer(form.movingDate);
    setShowNextQuestion(false);
  }, [form.movingDate]);

  const handleOpenAddressModal = useCallback(
    (type: TAddressType) => {
      open({
        title: t("quote.selectAddressTitle", { place: t(`quote.${type}`) }),
        children: (
          <AddressModal
            onComplete={(addr) => {
              setForm((prev) => ({ ...prev, [type]: addr }));
              close();
            }}
            onClose={close}
          />
        ),
        buttons: [],
      });
    },
    [open, close],
  );

  const handleConfirmQuote = useCallback(() => {
    setStep(4);
    // 견적 확정 시 콘솔에 출력
    console.log("견적 요청 데이터:", form);
  }, [form]);

  // 답변 말풍선 렌더링
  const renderAnswerBubble = () => {
    if (!pendingAnswer) return null;

    let answerText = "";
    if (step === 1) {
      // getMovingTypeLabel 대신 t로 조합
      answerText = `${t(`quote.movingTypes.${pendingAnswer}`)} (${t(`quote.movingTypes.${pendingAnswer}Desc`)})`;
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
  };

  // 단계별 렌더링 함수
  const renderStep = () => {
    if (!showNextQuestion) return null;

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
            <SpeechBubble type="question">{t("quote.dateQuestion")}</SpeechBubble>
            <DateSection value={form.movingDate} onChange={handleDateChange} onComplete={handleDateComplete} />
          </div>
        );
      case 3:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="question">{t("quote.addressQuestion")}</SpeechBubble>
            <SpeechBubble type="question">
              <div className="flex min-w-[279px] flex-col gap-2 px-6 py-5">
                <AddressSection
                  label="departure"
                  value={form.departure}
                  onClick={() => handleOpenAddressModal("departure")}
                />
                <AddressSection
                  label="arrival"
                  value={form.arrival}
                  onClick={() => handleOpenAddressModal("arrival")}
                />
                <Button
                  variant="solid"
                  width="w-full"
                  height="h-[54px]"
                  rounded="rounded-[16px]"
                  state={form.arrival.roadAddress ? "default" : "disabled"}
                  disabled={!form.arrival.roadAddress}
                  onClick={handleConfirmQuote}
                >
                  {t("quote.confirmQuote")}
                </Button>
              </div>
            </SpeechBubble>
          </div>
        );
      case 4:
        return (
          <div className="fade-in-up">
            <SpeechBubble type="answer" isLatest={true}>
              <div>
                <div>
                  {t("quote.result.movingType")}:{" "}
                  {form.movingType
                    ? `${t(`quote.movingTypes.${form.movingType}`)} (${t(`quote.movingTypes.${form.movingType}Desc`)})`
                    : ""}
                </div>
                <div>
                  {t("quote.result.movingDate")}: {formatDateByLanguage(form.movingDate, language)}
                </div>
                <div>
                  {t("quote.result.departure")}: {form.departure.roadAddress} {form.departure.detailAddress}
                </div>
                <div>
                  {t("quote.result.arrival")}: {form.arrival.roadAddress} {form.arrival.detailAddress}
                </div>
              </div>
            </SpeechBubble>
          </div>
        );
      default:
        return null;
    }
  };

  // 이전 답변들 렌더링
  const renderPreviousAnswers = () => {
    const answers = [];

    // 이사 종류 답변: step 2(날짜 선택 질문)가 나온 후부터 수정 가능
    if (step > 1 && form.movingType) {
      answers.push(
        <div key="movingType" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(1);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {form.movingType
              ? `${t(`quote.movingTypes.${form.movingType}`)} (${t(`quote.movingTypes.${form.movingType}Desc`)})`
              : ""}
          </SpeechBubble>
        </div>,
      );
    }

    // 날짜 답변: step 3(주소 선택 질문)가 나온 후부터 수정 가능
    if (step > 2 && form.movingDate) {
      answers.push(
        <div key="movingDate" className="fade-in-up">
          <SpeechBubble
            type="answer"
            isLatest={false}
            onEdit={() => {
              setStep(2);
              setShowNextQuestion(true);
              setPendingAnswer(null);
            }}
          >
            {formatDateByLanguage(form.movingDate, language)}
          </SpeechBubble>
        </div>,
      );
    }

    return answers;
  };

  return (
    <div className="min-h-screen bg-gray-200">
      <style jsx>{fadeInUpAnimation}</style>

      {/* 상태바 영역 */}
      <div className="sticky top-[72px] z-10 border-b border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-2lg text-black-400 leading-lg mb-4 font-semibold">{t("quote.title")}</h2>
        <ProgressBar value={progress} />
      </div>

      {/* 말풍선 영역 */}
      <div className="space-y-4 p-6">
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("quote.intro")}</SpeechBubble>
        </div>
        <div className="fade-in-up">
          <SpeechBubble type="question">{t("quote.movingTypeQuestion")}</SpeechBubble>
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

export default QuoteCreatePage;
