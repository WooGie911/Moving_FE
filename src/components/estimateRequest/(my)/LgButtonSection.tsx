"use client";
import { Button } from "@/components/common/button/Button";
import React from "react";
import { useTranslations } from "next-intl";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LgButtonSectionProps {
  estimateId: string;
  estimateStatus: string;
  hasConfirmedEstimate: boolean;
  estimatePrice: string;
}

export const LgButtonSection = ({
  estimateId,
  estimateStatus,
  hasConfirmedEstimate,
  estimatePrice,
}: LgButtonSectionProps) => {
  const t = useTranslations("estimateRequest");
  const tCommon = useTranslations("common");
  const tShared = useTranslations();
  const { open, close } = useModal();
  const queryClient = useQueryClient();

  // 견적 확정 API 호출을 위한 mutation
  const confirmEstimateMutation = useMutation({
    mutationFn: (estimateId: string) => customerEstimateRequestApi.confirmEstimate(estimateId),
    onSuccess: () => {
      // 성공 시 모달 닫기
      close();

      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequest"] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests"] });

      console.log("견적 확정 처리 성공");
    },
    onError: (error) => {
      console.error("견적 확정 처리 실패:", error);
      // TODO: 에러 메시지 표시
    },
  });

  // 견적 확정 핸들러
  const handleConfirmEstimate = () => {
    if (!estimateId) {
      console.error("견적 ID가 없습니다.");
      return;
    }

    confirmEstimateMutation.mutate(estimateId);
  };

  // 버튼 상태 결정
  const getButtonState = () => {
    if (estimateStatus === "ACCEPTED") {
      return {
        text: t("alreadyConfirmed"),
        disabled: true,
        state: "disabled" as const,
      };
    } else if (estimateStatus === "AUTO_REJECTED") {
      return {
        text: t("otherEstimateConfirmed"),
        disabled: true,
        state: "disabled" as const,
      };
    } else if (estimateStatus === "REJECTED" || estimateStatus === "EXPIRED") {
      return {
        text: t("notConfirmedEstimate"),
        disabled: true,
        state: "disabled" as const,
      };
    } else {
      return {
        text: confirmEstimateMutation.isPending ? tCommon("loading") : t("confirmEstimateButton"),
        disabled: confirmEstimateMutation.isPending,
        state: confirmEstimateMutation.isPending ? ("disabled" as const) : ("default" as const),
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-start justify-center gap-7">
        <div>
          <p className="text-[18px] leading-[26px] font-semibold text-gray-300">{t("estimatePrice")}</p>
          <p className="text-black-300 text-[24px] leading-[32px] font-bold">{`${estimatePrice}${tShared("shared.units.currency")}`}</p>
        </div>
        <Button
          variant="solid"
          width="w-[320px]"
          height="h-[64px]"
          rounded="rounded-[16px]"
          state={buttonState.state}
          disabled={buttonState.disabled}
          onClick={() => {
            if (!buttonState.disabled) {
              open({
                title: t("confirmEstimate"),
                children: (
                  <div className="flex flex-col items-center justify-center">
                    <p>{t("confirmEstimateQuestion")}</p>
                  </div>
                ),
                type: "bottomSheet",
                buttons: [
                  {
                    text: confirmEstimateMutation.isPending ? tCommon("loading") : t("confirmEstimateButton"),
                    onClick: handleConfirmEstimate,
                    disabled: confirmEstimateMutation.isPending,
                  },
                  {
                    text: tCommon("cancel"),
                    onClick: () => close(),
                  },
                ],
              });
            }
          }}
        >
          {buttonState.text}
        </Button>
      </div>
    </div>
  );
};
