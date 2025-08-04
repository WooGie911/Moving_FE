"use client";
import Image from "next/image";
import React from "react";
import like from "@/assets/icon/like/icon-like-black.png";
import { Button } from "@/components/common/button/Button";
import { useTranslations } from "next-intl";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface LastButtonSectionProps {
  estimateId: string;
  estimateStatus: string;
  hasConfirmedEstimate: boolean;
}

export const LastButtonSection = ({ estimateId, estimateStatus, hasConfirmedEstimate }: LastButtonSectionProps) => {
  const t = useTranslations("estimateRequest");
  const tCommon = useTranslations("common");
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
        text: confirmEstimateMutation.isPending ? t("processing") : t("confirmEstimateButton"),
        disabled: confirmEstimateMutation.isPending,
        state: confirmEstimateMutation.isPending ? ("disabled" as const) : ("default" as const),
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <div className="flex w-full flex-row items-center justify-center gap-2 py-7">
      <button className="border-border-light flex h-[54px] w-[54px] flex-row items-center justify-center rounded-[16px] border-1 lg:hidden">
        <div className="relative h-6 w-6">
          <Image src={like} alt="like" fill />
        </div>
      </button>
      <Button
        variant="solid"
        width="w-full"
        height="h-[54px]"
        rounded="rounded-[8px]"
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
  );
};
