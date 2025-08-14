"use client";
import Image from "next/image";
import React from "react";
import like from "@/assets/icon/like/icon-like-red.svg";
import unlike from "@/assets/icon/like/icon-like-black.svg";
import { Button } from "@/components/common/button/Button";
import { useTranslations, useLocale } from "next-intl";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TMoverInfo } from "@/types/customerEstimateRequest";
import { FavoriteService } from "@/services/favoriteService";

interface ILastButtonSectionProps {
  estimateId: string;
  estimateStatus: string;
  hasConfirmedEstimate: boolean;
  mover: TMoverInfo;
}

export const LastButtonSection = ({
  estimateId,
  estimateStatus,
  hasConfirmedEstimate,
  mover,
}: ILastButtonSectionProps) => {
  const t = useTranslations("customerEstimateRequest");
  const tCommon = useTranslations();
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
        text: confirmEstimateMutation.isPending ? t("processing") : t("confirmEstimateButton"),
        disabled: confirmEstimateMutation.isPending,
        state: confirmEstimateMutation.isPending ? ("disabled" as const) : ("default" as const),
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <section
      className="flex w-full flex-row items-center justify-center gap-2 py-7"
      aria-label={t("estimateActionSection")}
      role="region"
    >
      <button
        className={`border-border-light relative flex h-[54px] w-[54px] cursor-pointer flex-row items-center justify-center rounded-[16px] border-1 hover:cursor-pointer lg:hidden`}
        onClick={handleFavorite}
        disabled={favoriteMutation.isPending}
        aria-label={mover.isFavorite ? t("removeFromFavorites") : t("addToFavorites")}
        aria-pressed={mover.isFavorite}
        aria-describedby="favorite-button-description"
        type="button"
      >
        <div className="relative flex h-[16px] w-[16px] items-center justify-center">
          <Image
            src={mover.isFavorite ? like : unlike}
            alt={mover.isFavorite ? t("favoriteIconActive") : t("favoriteIconInactive")}
            fill
            className="object-contain"
          />
        </div>
        <span id="favorite-button-description" className="sr-only">
          {mover.isFavorite ? t("removeFromFavoritesDescription") : t("addToFavoritesDescription")}
        </span>
      </button>
      <Button
        variant="solid"
        width="w-full"
        height="h-[54px]"
        rounded="rounded-[8px]"
        state={buttonState.state}
        disabled={buttonState.disabled}
        aria-label={t("confirmEstimateButton")}
        aria-describedby="confirm-button-description"
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
                  text: confirmEstimateMutation.isPending ? t("loading") : t("confirmEstimateButton"),
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
        <span id="confirm-button-description" className="sr-only">
          {t("confirmEstimateButtonDescription")}
        </span>
      </Button>
    </section>
  );
};
