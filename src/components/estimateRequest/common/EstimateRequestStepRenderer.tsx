import React, { useCallback } from "react";
import SpeechBubble from "@/components/estimateRequest/create/SpeechBubble";
import { Button } from "@/components/common/button/Button";
import dynamic from "next/dynamic";
const MovingTypeSection = dynamic(() => import("@/components/estimateRequest/create/sections/MovingTypeSection"), {
  ssr: false,
});
const DateSection = dynamic(() => import("@/components/estimateRequest/create/sections/DateSection"), {
  ssr: false,
});
const AddressSection = dynamic(() => import("@/components/estimateRequest/create/sections/AddressSection"), {
  ssr: false,
});
import { ESTIMATE_REQUEST_STYLES } from "./EstimateRequestLayout";
import { IFormState, IEstimateRequestStepRendererProps } from "@/types/estimateRequest";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";

export const EstimateRequestStepRenderer: React.FC<IEstimateRequestStepRendererProps> = ({
  step,
  showNextQuestion,
  form,
  t,
  locale,
  isFormValid,
  onSelectMovingType,
  onDateChange,
  onDateComplete,
  onDepartureModal,
  onArrivalModal,
  onConfirmEstimateRequest,
  customButtonText,
  showConfirmModal,
}) => {
  const renderStep = useCallback(() => {
    if (!showNextQuestion) return undefined;

    switch (step) {
      // case 1: 이사 종류(소형/가정/사무실) 선택 화면
      case 1:
        return (
          // LCP 구간: 초기 페인트 지연 방지를 위해 애니메이션 제거
          <section role="region" aria-label="이사 종류 선택">
            <MovingTypeSection value={form.movingType} onSelect={onSelectMovingType} />
          </section>
        );
      // case 2: 이사 날짜 선택 화면
      case 2:
        return (
          <section className="animate-fade-in-up" role="region" aria-label="이사 날짜 선택">
            <SpeechBubble type="question">{t("estimateRequest.dateQuestion")}</SpeechBubble>
            <SpeechBubble type="question">
              <DateSection
                value={form.movingDate}
                onChange={onDateChange}
                onComplete={onDateComplete}
                className="mx-auto min-w-[327px] lg:max-w-160"
              />
            </SpeechBubble>
          </section>
        );
      // case 3: 출발지/도착지 주소 입력 화면
      case 3:
        return (
          <section className="animate-fade-in-up" role="region" aria-label="주소 입력">
            <SpeechBubble type="question">{t("estimateRequest.addressQuestion")}</SpeechBubble>
            <SpeechBubble type="question">
              <div className={ESTIMATE_REQUEST_STYLES.addressContainer}>
                <AddressSection label="departure" value={form.departure} onClick={onDepartureModal} />
                <AddressSection label="arrival" value={form.arrival} onClick={onArrivalModal} />
                <Button
                  variant="solid"
                  width={ESTIMATE_REQUEST_STYLES.buttonFull}
                  height={ESTIMATE_REQUEST_STYLES.button}
                  rounded="rounded-[16px]"
                  fontSize="text-base"
                  disabled={!form.departure.roadAddress || !form.arrival.roadAddress}
                  onClick={() => {
                    if (showConfirmModal) {
                      showConfirmModal(() => onConfirmEstimateRequest(form));
                    } else {
                      // fallback: 모달이 없으면 window.confirm 사용
                      if (
                        typeof window !== "undefined" &&
                        window.confirm(
                          t("estimateRequest.confirmEstimateRequestMessage") || "정말 견적을 확정하시겠습니까?",
                        )
                      ) {
                        onConfirmEstimateRequest(form);
                      }
                    }
                  }}
                  className="mt-6"
                  aria-label="견적 요청 확정"
                >
                  {customButtonText || t("estimateRequest.confirmEstimateRequest")}
                </Button>
              </div>
            </SpeechBubble>
          </section>
        );
      // case 4: 입력한 모든 정보를 요약해서 보여주고, 최종 확인(요청) 버튼을 제공하는 화면
      case 4:
        return (
          <section className="animate-fade-in-up" role="region" aria-label="견적 요청 정보 확인">
            <SpeechBubble type="answer" isLatest={true}>
              <div className={ESTIMATE_REQUEST_STYLES.resultContainer} role="list" aria-label="견적 요청 정보 목록">
                <div className={ESTIMATE_REQUEST_STYLES.resultItem} role="listitem">
                  {t("estimateRequest.result.movingType")}:{" "}
                  {form.movingType
                    ? `${t(`shared.movingTypes.${form.movingType}`)} (${t(`shared.movingTypes.${form.movingType}Desc`)})`
                    : ""}
                </div>
                <div className={ESTIMATE_REQUEST_STYLES.resultItem} role="listitem">
                  {t("estimateRequest.result.movingDate")}: {formatDateByLanguage(form.movingDate, locale)}
                </div>
                <div className={ESTIMATE_REQUEST_STYLES.resultItem} role="listitem">
                  {t("estimateRequest.result.departure")}: {shortenRegionInAddress(form.departure.roadAddress)}{" "}
                  {form.departure.detailAddress}
                </div>
                <div className={ESTIMATE_REQUEST_STYLES.resultItem} role="listitem">
                  {t("estimateRequest.result.arrival")}: {shortenRegionInAddress(form.arrival.roadAddress)}{" "}
                  {form.arrival.detailAddress}
                </div>
              </div>
            </SpeechBubble>
            {isFormValid() && (
              <SpeechBubble type="question">
                <div className={ESTIMATE_REQUEST_STYLES.questionContainer}>
                  <p className={ESTIMATE_REQUEST_STYLES.questionText}>{t("estimateRequest.confirmQuestion")}</p>
                  <Button
                    variant="solid"
                    width={ESTIMATE_REQUEST_STYLES.buttonFull}
                    height={ESTIMATE_REQUEST_STYLES.button}
                    rounded="rounded-[16px]"
                    onClick={() => onConfirmEstimateRequest(form)}
                    aria-label="견적 요청 최종 확정"
                  >
                    {t("estimateRequest.confirmEstimateRequest")}
                  </Button>
                </div>
              </SpeechBubble>
            )}
          </section>
        );
      default:
        return undefined;
    }
  }, [
    showNextQuestion,
    step,
    form,
    t,
    locale,
    isFormValid,
    onSelectMovingType,
    onDateChange,
    onDateComplete,
    onDepartureModal,
    onArrivalModal,
    onConfirmEstimateRequest,
  ]);

  return renderStep();
};
