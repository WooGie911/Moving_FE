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
import like from "@/assets/icon/like/icon-like-red.svg";
import unlike from "@/assets/icon/like/icon-like-black.svg";

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
  const t = useTranslations("customerEstimateRequest");
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
        ariaLabel: t("aria.confirmEstimateButtonAlreadyConfirmed"),
      };
    } else if (estimateStatus === "AUTO_REJECTED") {
      return {
        text: t("otherEstimateConfirmed"),
        disabled: true,
        state: "disabled" as const,
        ariaLabel: t("aria.confirmEstimateButtonRejected"),
      };
    } else if (estimateStatus === "REJECTED" || estimateStatus === "EXPIRED") {
      return {
        text: t("notConfirmedEstimate"),
        disabled: true,
        state: "disabled" as const,
        ariaLabel:
          estimateStatus === "REJECTED"
            ? t("aria.confirmEstimateButtonRejected")
            : t("aria.confirmEstimateButtonExpired"),
      };
    } else {
      return {
        text: confirmEstimateMutation.isPending ? t("loading") : t("confirmEstimateButton"),
        disabled: confirmEstimateMutation.isPending,
        state: confirmEstimateMutation.isPending ? ("disabled" as const) : ("default" as const),
        ariaLabel: confirmEstimateMutation.isPending
          ? t("aria.confirmEstimateButtonLoading")
          : t("aria.confirmEstimateButtonActive"),
      };
    }
  };

  const buttonState = getButtonState();

  return (
    <section className="hidden lg:block" aria-label={t("aria.largeButtonSection")}>
      <div className="flex flex-col items-start justify-center gap-7">
        <div aria-label={t("aria.estimatePriceDisplay")} role="region">
          <p className="text-[18px] leading-[26px] font-semibold text-gray-300">{t("estimatePrice")}</p>
          <p className="text-black-300 text-[24px] leading-[32px] font-bold" aria-label={t("aria.estimatePriceAmount")}>
            {`${estimatePrice}${tShared("shared.units.currency")}`}
          </p>
        </div>
        <div
          className="flex w-full flex-row items-center justify-center gap-2"
          aria-label={t("aria.favoriteButtonSection")}
          role="group"
        >
          <button
            className={`border-border-light relative flex h-[64px] w-[64px] cursor-pointer flex-row items-center justify-center rounded-[16px] border-1 hover:cursor-pointer`}
            onClick={handleFavorite}
            disabled={favoriteMutation.isPending}
            aria-label={mover.isFavorite ? t("aria.favoriteButtonActive") : t("aria.favoriteButtonInactive")}
            aria-pressed={mover.isFavorite}
            aria-describedby="favorite-button-description"
          >
            <div className="relative flex h-[16px] w-[16px] items-center justify-center">
              <Image
                src={mover.isFavorite ? like : unlike}
                alt={mover.isFavorite ? t("aria.favoriteButtonActive") : t("aria.favoriteButtonInactive")}
                fill
                className="object-contain"
              />
            </div>
          </button>
          <div aria-label={t("aria.confirmEstimateButtonSection")} role="group">
            <Button
              variant="solid"
              width="w-[320px]"
              height="h-[64px]"
              rounded="rounded-[16px]"
              state={buttonState.state}
              disabled={buttonState.disabled}
              aria-label={buttonState.ariaLabel}
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
                        text: t("cancel"),
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
      {/* 스크린 리더를 위한 숨겨진 설명 텍스트 */}
      <div className="sr-only">
        <div id="favorite-button-description">
          {mover.isFavorite ? t("removeFromFavoritesDescription") : t("addToFavoritesDescription")}
        </div>
        <div id="confirm-button-description">{t("confirmEstimateButtonDescription")}</div>
      </div>
    </section>
  );
};
