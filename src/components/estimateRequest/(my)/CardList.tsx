"use client";

import React, { useState } from "react";
import confirm from "@/assets/icon/etc/icon-confirm.svg";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { ICardListProps } from "@/types/customerEstimateRequest";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { MoverInfo } from "./MoverInfo";
import { useModal } from "@/components/common/modal/ModalContext";
import Image from "next/image";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { formatNumber } from "@/lib/utils/formatNumber";

export const CardList = ({ estimate, estimateRequest, usedAt, hasConfirmedEstimate }: ICardListProps) => {
  const { open, close } = useModal();
  const t = useTranslations("estimateRequest");
  const tShared = useTranslations();
  const tCommon = useTranslations("common");
  const queryClient = useQueryClient();
  const locale = useLocale();

  // 확정견적이 있는 경우의 추가 로직
  const isConfirmedEstimate = estimate.status === "ACCEPTED";
  const shouldDisableConfirmButton = hasConfirmedEstimate && !isConfirmedEstimate;
  const { mutate: confirmEstimate, isPending: isConfirming } = useMutation({
    mutationFn: (id: string) => customerEstimateRequestApi.confirmEstimate(id),
    onSuccess: () => {
      // 캐시 무효화하여 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests", locale] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests", locale] });
      // 기사님 관련 페이지 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["MyRequestEstimates"] });
      queryClient.invalidateQueries({ queryKey: ["MyRejectedEstimates"] });

      open({
        title: t("confirmSuccess"),
        children: <div className="py-4 text-center">{t("estimateConfirmed")}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
    onError: () => {
      open({
        title: t("confirmFailed"),
        children: <div className="py-4 text-center">{t("confirmationFailed")}</div>,
        type: "bottomSheet",
        buttons: [{ text: t("close"), onClick: () => close() }],
      });
    },
  });

  const handleConfirmEstimate = () => {
    confirmEstimate(estimate.id);
  };

  const openConfirmModal = () => {
    open({
      title: t("confirmEstimate"),
      children: <div className="py-4 text-center">{t("confirmEstimateQuestion")}</div>,
      type: "bottomSheet",
      buttons: [
        {
          text: tCommon("cancel"),
          onClick: () => close(),
          variant: "outlined",
        },
        {
          text: isConfirming ? tCommon("loading") : tCommon("confirm"),
          onClick: handleConfirmEstimate,
          disabled: isConfirming,
        },
      ],
    });
  };

  const cardContent = (
    <article
      className={`flex w-full flex-col items-center justify-center gap-4 rounded-[20px] bg-[#ffffff] py-6 ${usedAt === "received" ? "" : "border-border-light max-w-[375px] border-[0.5px] px-3 md:max-w-[600px] md:px-5 lg:max-w-[558px]"}`}
      aria-label={t("aria.estimateCard")}
      role="article"
    >
      <header
        className="flex w-full flex-col items-center justify-center gap-1"
        aria-label={t("aria.estimateCardHeader")}
      >
        {/* 라벨과 견적상태 영역 */}
        <LabelAndTitleSection mover={estimate.mover} estimate={estimate} usedAt={usedAt} />
        {/* 기사님 프로필 영역 */}
        <MoverInfo
          mover={estimate.mover}
          usedAt={usedAt}
          estimateId={estimate.id}
          hasConfirmedEstimate={hasConfirmedEstimate}
        />
      </header>

      <main className="flex w-full flex-col" aria-label={t("aria.estimateCardBody")}>
        {/* 견적서 금액 영역 */}
        {usedAt === "pending" ? (
          <section
            className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3"
            aria-label={t("aria.estimateAmountSection")}
          >
            <p
              className="text-[14px] leading-[24px] font-normal text-gray-300 md:text-[16px] md:leading-[26px] md:font-medium"
              aria-label={t("aria.estimateAmountLabel")}
            >
              {t("estimateAmount")}
            </p>
            <p
              className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold"
              aria-label={t("aria.estimateAmountValue")}
            >
              {`${formatNumber(estimate.price)}${t("currency")}`}
            </p>
          </section>
        ) : (
          <section
            className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3"
            aria-label={t("aria.estimateStatusSection")}
          >
            <div
              className="flex flex-row items-center justify-start gap-1 md:hidden"
              aria-label={t("aria.estimateStatusSection")}
            >
              {estimate.status === "PROPOSED" ? (
                <p
                  className="text-[16px] leading-[26px] font-semibold text-gray-300"
                  aria-label={t("aria.estimateStatusValue")}
                >
                  {t("estimateWaiting")}
                </p>
              ) : estimate.status === "ACCEPTED" ? (
                <div
                  className="flex flex-row items-center justify-center gap-1"
                  aria-label={t("aria.estimateStatusSection")}
                >
                  <div className="relative h-[16px] w-[16px]">
                    <Image
                      src={confirm}
                      alt={t("aria.confirmIcon")}
                      fill
                      className="object-contain"
                      aria-label={t("aria.estimateStatusIcon")}
                    />
                  </div>
                  <p
                    className="text-primary-400 text-[16px] leading-[26px] font-bold"
                    aria-label={t("aria.estimateStatusValue")}
                  >
                    {t("confirmedEstimate")}
                  </p>
                </div>
              ) : (
                <p
                  className="text-[16px] leading-[26px] font-semibold text-gray-300"
                  aria-label={t("aria.estimateStatusValue")}
                >
                  {t("rejectedEstimate")}
                </p>
              )}
            </div>
            <div className="flex flex-row items-center justify-end gap-3" aria-label={t("aria.estimateAmountSection")}>
              <p
                className="text-[14px] leading-[24px] font-normal text-gray-500 md:text-[16px] md:leading-[26px] md:font-medium"
                aria-label={t("aria.estimateAmountLabel")}
              >
                {t("estimateAmount")}
              </p>
              <p
                className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold"
                aria-label={t("aria.estimateAmountValue")}
              >
                {`${formatNumber(estimate.price)}${t("currency")}`}
              </p>
            </div>
          </section>
        )}
      </main>

      {usedAt === "pending" ? (
        <footer
          className="flex w-full flex-col items-center justify-center"
          aria-label={t("aria.estimateActionSection")}
        >
          <div
            className="flex w-full flex-col items-center justify-center gap-[11px] px-5 md:hidden"
            aria-label={t("aria.estimateCardButtonGroupMobile")}
          >
            <Button
              variant="solid"
              state={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? "default" : "disabled"}
              width="w-[287px]"
              height="h-[54px]"
              rounded="rounded-[12px]"
              onClick={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? openConfirmModal : undefined}
              disabled={estimate.status !== "PROPOSED" || shouldDisableConfirmButton}
              aria-label={t("aria.confirmButton")}
              aria-describedby={`estimate-status-${estimate.id}`}
            >
              {estimate.status === "PROPOSED"
                ? t("confirmEstimateButton")
                : estimate.status === "ACCEPTED"
                  ? t("alreadyConfirmed")
                  : t("otherEstimateConfirmed")}
            </Button>
            <Link href={`/estimateRequest/pending/${estimate.id}`} aria-label={t("aria.estimateCardLink")}>
              <Button
                variant="outlined"
                state="default"
                width="w-[287px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                aria-label={t("aria.viewDetailsButton")}
              >
                {t("viewDetails")}
              </Button>
            </Link>
          </div>

          <div className="hidden w-full md:block" aria-label={t("aria.estimateCardButtonGroupDesktop")}>
            <div className="flex w-full flex-row items-center justify-between gap-[11px]">
              <Link href={`/estimateRequest/pending/${estimate.id}`} aria-label={t("aria.estimateCardLink")}>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-[254px] lg:w-[233px]"
                  height="h-[54px]"
                  rounded="rounded-[12px]"
                  aria-label={t("aria.viewDetailsButton")}
                >
                  {t("viewDetails")}
                </Button>
              </Link>
              <Button
                variant="solid"
                state={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? "default" : "disabled"}
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? openConfirmModal : undefined}
                disabled={estimate.status !== "PROPOSED" || shouldDisableConfirmButton}
                aria-label={t("aria.confirmButton")}
                aria-describedby={`estimate-status-${estimate.id}`}
              >
                {estimate.status === "PROPOSED"
                  ? t("confirmEstimateButton")
                  : estimate.status === "ACCEPTED"
                    ? t("alreadyConfirmed")
                    : t("otherEstimateConfirmed")}
              </Button>
            </div>
          </div>
        </footer>
      ) : null}

      {/* 스크린 리더를 위한 숨겨진 상태 설명 */}
      <div id={`estimate-status-${estimate.id}`} className="sr-only">
        {estimate.status === "PROPOSED"
          ? t("estimateWaiting")
          : estimate.status === "ACCEPTED"
            ? t("confirmedEstimate")
            : t("rejectedEstimate")}
      </div>
    </article>
  );

  return usedAt === "received" ? (
    <Link href={`/estimateRequest/received/${estimate.id}`} aria-label={t("aria.estimateCardLink")}>
      {cardContent}
    </Link>
  ) : (
    cardContent
  );
};
