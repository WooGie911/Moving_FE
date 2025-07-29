"use client";

import React, { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { EstimateRequestLayout } from "@/components/estimateRequest/common/EstimateRequestLayout";
import { EstimateRequestStepRenderer } from "@/components/estimateRequest/common/EstimateRequestStepRenderer";
import { useEstimateRequestForm } from "@/hooks/useEstimateRequestForm";
import { useEstimateRequestApi } from "@/hooks/useEstimateRequestApi";
import { useEstimateRequestAddressModal } from "@/hooks/useEstimateRequestAddressModal";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { formatDateByLanguage } from "@/utils/dateUtils";

const EstimateRequestCreatePage = () => {
  const router = useRouter();

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
    isFormValid,
    handleSelectMovingType,
    handleDateChange,
    handleDateComplete,
    handleEditStep,
    handleAddressUpdate,
    getAnswerText,
    handleEditMovingType,
    handleEditMovingDate,
    handleEditAddress,
    renderAnswerBubble,
    renderPreviousAnswers,
    t,
    locale,
  } = formLogic;

  const { createMutation, activeQuery } = apiLogic;

  // 주소 모달 훅 사용
  const { handleDepartureModal, handleArrivalModal } = useEstimateRequestAddressModal(handleAddressUpdate);

  // 견적 존재 여부 확인 및 자동 분기
  useEffect(() => {
    checkAndRedirectToEdit();
  }, []);

  // 견적 존재 여부 확인 및 edit 페이지로 리다이렉트
  const checkAndRedirectToEdit = async () => {
    try {
      console.log("🔍 활성 견적 요청 확인 중...");
      const response = await activeQuery.refetch();
      console.log("📡 API 응답:", response);

      if (response.data?.success && response.data?.hasActive) {
        console.log("✅ 활성 견적 발견 - 수정 페이지로 이동");
        // 활성 견적이 있으면 edit 페이지로 리다이렉트
        router.push("/estimateRequest/edit");
        return;
      } else {
        console.log("❌ 활성 견적 없음 - 생성 페이지 유지");
        console.log("응답 데이터:", response.data);
      }

      // 활성 견적이 없으면 create 페이지에서 계속 진행
    } catch (error) {
      console.error("❌ 견적 존재 여부 확인 실패:", error);
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
  }, [pendingAnswer, step, setShowNextQuestion, setPendingAnswer, setStep]);

  return (
    <EstimateRequestLayout title={t("estimateRequest.title")} progress={progress}>
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
        locale={locale}
        isFormValid={isFormValid}
        onSelectMovingType={handleSelectMovingType}
        onDateChange={handleDateChange}
        onDateComplete={handleDateComplete}
        onDepartureModal={handleDepartureModal}
        onArrivalModal={handleArrivalModal}
        onConfirmEstimateRequest={createMutation.mutate}
        showConfirmModal={apiLogic.showConfirmEstimateRequestModal}
      />
    </EstimateRequestLayout>
  );
};

export default EstimateRequestCreatePage;
