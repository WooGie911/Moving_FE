"use client";

import React, { useEffect, useMemo } from "react";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { EstimateRequestLayout } from "@/components/estimateRequest/common/EstimateRequestLayout";
import { EstimateRequestStepRenderer } from "@/components/estimateRequest/common/EstimateRequestStepRenderer";
import { useEstimateRequestForm } from "@/hooks/useEstimateRequestForm";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useEstimateRequestAddressModal } from "@/hooks/useEstimateRequestAddressModal";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { UseQueryResult } from "@tanstack/react-query";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";

interface EstimateRequestFlowProps {
  title: string;
  onConfirm: (form: any) => void;
  customButtonText?: string;
  showConfirmModal?: (callback: () => void) => void;
  activeQuery?: UseQueryResult<any>;
  enableUnsavedGuard?: boolean;
}

export const EstimateRequestFlow: React.FC<EstimateRequestFlowProps> = ({
  title,
  onConfirm,
  customButtonText,
  showConfirmModal,
  activeQuery: externalActiveQuery,
  enableUnsavedGuard = false,
}) => {
  // 공통 훅들 사용
  const formLogic = useEstimateRequestForm();
  const apiLogic = useEstimateRequestApi();

  const {
    form,
    step,
    setStep,
    showNextQuestion,
    setShowNextQuestion,
    pendingAnswer,
    setPendingAnswer,
    progress,
    isDirty,
    handleAddressUpdate,
    renderAnswerBubble,
    renderPreviousAnswers,
    t,
    locale,
  } = formLogic;

  // 이탈 방지 가드: 생성 플로우 등에서만 활성화
  const { bypassNextNavigation, bypassFor } = useUnsavedChangesGuard(enableUnsavedGuard && isDirty);

  // 외부에서 전달받은 activeQuery 사용
  const activeQuery = externalActiveQuery;

  // API 로딩 상태 확인
  // 최초 로딩시에만 전체 로더를 노출하고, 기존 데이터가 있는 상태에서의 백그라운드 refetch(isFetching)에는 로더를 노출하지 않아 깜빡임을 방지
  const isPending = !!activeQuery && activeQuery.isLoading && !activeQuery.data;

  // 주소 모달 훅 사용
  const { handleDepartureModal, handleArrivalModal } = useEstimateRequestAddressModal(handleAddressUpdate);

  // 답변 후 다음 질문 표시를 위한 타이머 (공통 로직)
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

  // 로딩 중일 때
  if (isPending) {
    return (
      <main className="min-h-screen bg-gray-200" role="main" aria-label="견적 요청 로딩 중">
        <MovingTruckLoader size="lg" loadingText={t("estimateRequest.loadingText")} />
      </main>
    );
  }

  return (
    <EstimateRequestLayout title={title} progress={progress}>
      <section role="region" aria-label={t("estimateRequest.aria.introSection")}>
        <SpeechBubble type="question">
          <span className="sr-only">견적 요청 안내: </span>
          {t("estimateRequest.intro")}
        </SpeechBubble>
      </section>
      <section role="region" aria-label={t("estimateRequest.aria.movingTypeQuestionSection")}>
        <SpeechBubble type="question">
          <span className="sr-only">이사 종류 질문: </span>
          {t("estimateRequest.movingTypeQuestion")}
        </SpeechBubble>
      </section>

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
        locale={locale as "ko" | "en" | "zh"}
        isFormValid={formLogic.isFormValid}
        onSelectMovingType={formLogic.handleSelectMovingType}
        onDateChange={formLogic.handleDateChange}
        onDateComplete={formLogic.handleDateComplete}
        onDepartureModal={handleDepartureModal}
        onArrivalModal={handleArrivalModal}
        onConfirmEstimateRequest={(data) => {
          // 제출 시에는 가드를 잠시 비활성화하여 네이티브 새로고침 경고를 방지
          bypassFor(3000);
          onConfirm(data);
        }}
        customButtonText={customButtonText}
        showConfirmModal={showConfirmModal}
      />
    </EstimateRequestLayout>
  );
};
