"use client";
import { Button } from "@/components/common/button/Button";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMoverInfo } from "@/types/customerEstimateRequest";
import { FavoriteService } from "@/services/favoriteService";
import Image from "next/image";
import like from "@/assets/icon/like/icon-like-button-md.svg";

interface LgButtonSectionProps {
  estimateId: string;
  estimateStatus: string;
  hasConfirmedEstimate: boolean;
  estimatePrice: string;
  mover: TMoverInfo;
}

export const LgButtonSection = ({
  estimateId,
  estimateStatus,
  hasConfirmedEstimate,
  estimatePrice,
  mover,
}: LgButtonSectionProps) => {
  const t = useTranslations("estimateRequest");
  const tCommon = useTranslations("common");
  const tShared = useTranslations();
  const { open, close } = useModal();
  const queryClient = useQueryClient();
  const locale = useLocale();

  // 견적 확정 API 호출을 위한 mutation
  const confirmEstimateMutation = useMutation({
    mutationFn: (estimateId: string) => customerEstimateRequestApi.confirmEstimate(estimateId),
    onSuccess: () => {
      // 성공 시 모달 닫기
      close();

      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
      // 기사님 관련 페이지 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["MyRequestEstimates"] });
      queryClient.invalidateQueries({ queryKey: ["MyRejectedEstimates"] });
    },
    onError: (error) => {
      console.error("견적 확정 처리 실패:", error);
      // TODO: 에러 메시지 표시
    },
  });

  // 찜하기 추가/제거 mutation
  const favoriteMutation = useMutation({
    mutationFn: async (moverId: string) => {
      if (mover.isFavorite) {
        return await FavoriteService.removeFavorite(moverId);
      } else {
        return await FavoriteService.addFavorite(moverId);
      }
    },
    onSuccess: () => {
      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers", locale] });
    },
    onError: (error) => {
      console.error("찜하기 처리 실패:", error);
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

  // 찜하기 핸들러
  const handleFavorite = () => {
    if (!mover.id) {
      console.error("기사님 ID가 없습니다.");
      return;
    }

    favoriteMutation.mutate(mover.id);
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
        <div className="flex w-full flex-row items-center justify-center gap-2">
          <button
            className={`relative flex h-[64px] w-[64px] cursor-pointer flex-row items-center justify-center rounded-[16px] hover:cursor-pointer`}
            onClick={handleFavorite}
            disabled={favoriteMutation.isPending}
          >
            <Image src={like} alt="like" fill className="object-contain" />
          </button>
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
    </div>
  );
};
