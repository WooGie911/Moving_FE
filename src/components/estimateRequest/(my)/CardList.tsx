"use client";

import React, { useState } from "react";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { ICardListProps } from "@/types/customerEstimateRequest";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { MoverInfo } from "./MoverInfo";
import { useModal } from "@/components/common/modal/ModalContext";
import Image from "next/image";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { formatNumber } from "@/lib/utils/formatNumber";

export const CardList = ({ estimate, estimateRequest, usedAt, hasConfirmedEstimate }: ICardListProps) => {
  const { open, close } = useModal();
  const t = useTranslations("estimateRequest");
  const tShared = useTranslations();
  const tCommon = useTranslations("common");

  // 확정견적이 있는 경우의 추가 로직
  const isConfirmedEstimate = estimate.status === "ACCEPTED";
  const shouldDisableConfirmButton = hasConfirmedEstimate && !isConfirmedEstimate;
  const { mutate: confirmEstimate, isPending: isConfirming } = useMutation({
    mutationFn: (id: string) => customerEstimateRequestApi.confirmEstimate(id),
    onSuccess: () => {
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
          text: isConfirming ? tCommon("loading") : tCommon("confirm"),
          onClick: handleConfirmEstimate,
          disabled: isConfirming,
        },
        {
          text: tCommon("cancel"),
          onClick: () => close(),
        },
      ],
    });
  };

  const cardContent = (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 rounded-[20px] bg-[#ffffff] py-6 ${usedAt === "received" ? "" : "border-border-light max-w-[367px] border-[0.5px] px-4 md:max-w-[600px] md:px-5 lg:max-w-[558px]"}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1">
        {/* 라벨과 견적상태 영역 */}
        <LabelAndTitleSection mover={estimate.mover} estimate={estimate} usedAt={usedAt} />
        {/* 기사님 프로필 영역 */}
        <MoverInfo
          mover={estimate.mover}
          usedAt={usedAt}
          estimateId={estimate.id}
          hasConfirmedEstimate={hasConfirmedEstimate}
        />
      </div>

      {/* 견적서 금액 영역 */}
      {usedAt === "pending" ? (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <p className="text-[14px] leading-[24px] font-normal text-gray-300 md:text-[16px] md:leading-[26px] md:font-medium">
            {t("estimateAmount")}
          </p>
          <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimate.price)}${t("currency")}`}</p>
        </div>
      ) : (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <div className="flex w-full flex-row items-center justify-start gap-1 md:hidden">
            {estimate.status === "PROPOSED" ? (
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{t("estimateWaiting")}</p>
            ) : estimate.status === "ACCEPTED" ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={confirm} alt="confirm" width={16} height={16} />
                <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
              </div>
            ) : (
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{t("rejectedEstimate")}</p>
            )}
          </div>
          <div className="flex w-full flex-row items-center justify-end gap-3 md:justify-end">
            <p className="text-[14px] leading-[24px] font-normal text-gray-500 md:text-[16px] md:leading-[26px] md:font-medium">
              {t("estimateAmount")}
            </p>
            <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimate.price)}${t("currency")}`}</p>
          </div>
        </div>
      )}
      {usedAt === "pending" ? (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-[11px] px-5 md:hidden">
            <Button
              variant="solid"
              state={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? "default" : "disabled"}
              width="w-[287px]"
              height="h-[54px]"
              rounded="rounded-[12px]"
              onClick={estimate.status === "PROPOSED" && !shouldDisableConfirmButton ? openConfirmModal : undefined}
              disabled={estimate.status !== "PROPOSED" || shouldDisableConfirmButton}
            >
              {estimate.status === "PROPOSED"
                ? t("confirmEstimateButton")
                : estimate.status === "ACCEPTED"
                  ? t("alreadyConfirmed")
                  : t("otherEstimateConfirmed")}
            </Button>
            <Link href={`/estimateRequest/pending/${estimate.id}`}>
              <Button variant="outlined" state="default" width="w-[287px]" height="h-[54px]" rounded="rounded-[12px]">
                {t("viewDetails")}
              </Button>
            </Link>
          </div>

          <div className="hidden w-full md:block">
            <div className="flex w-full flex-row items-center justify-between gap-[11px]">
              <Link href={`/estimateRequest/pending/${estimate.id}`}>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-[254px] lg:w-[233px]"
                  height="h-[54px]"
                  rounded="rounded-[12px]"
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
              >
                {estimate.status === "PROPOSED"
                  ? t("confirmEstimateButton")
                  : estimate.status === "ACCEPTED"
                    ? t("alreadyConfirmed")
                    : t("otherEstimateConfirmed")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return usedAt === "received" ? (
    <Link href={`/estimateRequest/received/${estimate.id}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
};
