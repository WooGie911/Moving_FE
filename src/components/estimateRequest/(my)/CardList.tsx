"use client";

import Image from "next/image";
import React, { useState } from "react";
import defaultProfile from "@/assets/img/mascot/moverprofile-sm.png";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { ICardListProps } from "@/types/customerEstimateRequest";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { MoverInfo } from "./MoverInfo";
import { useModal } from "@/components/common/modal/ModalContext";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

// 숫자를 천 단위로 쉼표를 추가하는 함수
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const CardList = ({
  isDesignated,
  estimateId,
  estimateState,
  estimateTitle,
  estimatePrice,
  mover,
  type,
}: ICardListProps) => {
  const { open, close } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const t = useTranslations("estimateRequest");
  const tCommon = useTranslations("common");
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
    confirmEstimate(estimateId);
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
      className={`flex w-full flex-col items-center justify-center gap-4 rounded-[20px] bg-[#ffffff] py-6 ${type === "received" ? "" : "border-border-light max-w-[327px] border-[0.5px] px-4 md:max-w-[600px] md:px-5 lg:max-w-[558px]"}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <LabelAndTitleSection
          estimateState={estimateState}
          estimateTitle={estimateTitle}
          isDesignated={isDesignated}
          mover={mover}
          type={type}
          usedAtDetail={false}
        />
        {/* 기사님 프로필 영역 */}
        <div className={`flex w-full ${type === "received" ? "border-border-light rounded-lg border-2 p-2" : ""}`}>
          <div
            className={`flex w-full flex-row items-center justify-center gap-2 py-3 ${type === "pending" ? "border-border-light border-b-1" : ""} `}
          >
            {/* 좌측 프로필 이미지 */}
            <Image src={mover.moverImage ? mover.moverImage : defaultProfile} alt="profile" width={50} height={50} />
            {/* 프로필 이미지 외 모든 프로필 정보*/}
            <MoverInfo mover={mover} usedAtDetail={false} />
          </div>
        </div>
      </div>
      {/* 견적서 금액 영역 */}

      {type === "pending" ? (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <p className="text-[14px] leading-[24px] font-normal text-gray-300 md:text-[16px] md:leading-[26px] md:font-medium">
            {t("estimateAmount")}
          </p>
          <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimatePrice)}${t("currency")}`}</p>
        </div>
      ) : (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <div className="flex w-full flex-row items-center justify-start gap-1 md:hidden">
            {estimateState === "PROPOSED" ? (
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{t("estimateWaiting")}</p>
            ) : estimateState === "ACCEPTED" ? (
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
            <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimatePrice)}${t("currency")}`}</p>
          </div>
        </div>
      )}
      {type === "pending" ? (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-[11px] px-5 md:hidden">
            <Button
              variant="solid"
              state={estimateState === "PROPOSED" ? "default" : "disabled"}
              width="w-[287px]"
              height="h-[54px]"
              rounded="rounded-[12px]"
              onClick={estimateState === "PROPOSED" ? openConfirmModal : undefined}
              disabled={estimateState !== "PROPOSED"}
            >
              {estimateState === "PROPOSED"
                ? t("confirmEstimateButton")
                : estimateState === "ACCEPTED"
                  ? t("alreadyConfirmed")
                  : t("otherEstimateConfirmed")}
            </Button>
            <Link href={`/estimateRequest/pending/${estimateId}`}>
              <Button variant="outlined" state="default" width="w-[287px]" height="h-[54px]" rounded="rounded-[12px]">
                {t("viewDetails")}
              </Button>
            </Link>
          </div>

          <div className="hidden w-full md:block">
            <div className="flex w-full flex-row items-center justify-between gap-[11px]">
              <Link href={`/estimateRequest/pending/${estimateId}`}>
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
                state={estimateState === "PROPOSED" ? "default" : "disabled"}
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={estimateState === "PROPOSED" ? openConfirmModal : undefined}
                disabled={estimateState !== "PROPOSED"}
              >
                {estimateState === "PROPOSED"
                  ? t("confirmEstimateButton")
                  : estimateState === "ACCEPTED"
                    ? t("alreadyConfirmed")
                    : t("otherEstimateConfirmed")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return type === "received" ? (
    <Link href={`/estimateRequest/received/${estimateId}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
};
