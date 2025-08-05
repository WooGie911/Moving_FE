"use client";

import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import { Button } from "@/components/common/button/Button";
import Image from "next/image";
import React from "react";
import estimateIcon from "@/assets/icon/etc/icon-estimate.webp";
import { IAddress } from "@/types/review";
import defaultProfile from "@/assets/img/mascot/moverprofile-lg.webp";
import { useTranslations, useLocale } from "next-intl";
import { formatDateByLanguage } from "@/utils/dateUtils";
import { shortenRegionName } from "@/utils/regionMapping";

type TWrittenMoverCardProps = {
  id: string;
  profileImage: string | null;
  nickname: string;
  shortIntro: string;
  fromAddress: IAddress;
  toAddress: IAddress;
  moveDate: string;
  price: number;
  onClickWrite: () => void;
};

const WritableMoverCard = ({
  id,
  profileImage,
  nickname,
  shortIntro,
  fromAddress,
  toAddress,
  moveDate,
  price,
  onClickWrite,
}: TWrittenMoverCardProps) => {
  const t = useTranslations("review");
  const shared = useTranslations("shared");
  const locale = useLocale();

  return (
    <div className="mb-6 flex w-full max-w-[327px] min-w-[327px] flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg md:max-w-[600px] lg:h-[242px] lg:w-[1120px] lg:max-w-none lg:flex-row lg:justify-between">
      <div>
        <div className="flex gap-2 md:hidden">
          <MoveTypeLabel type="small" />
        </div>
        <div className="mt-2 flex flex-row items-start justify-between">
          {/* 프로필 이미지 */}
          <Image
            src={profileImage || defaultProfile}
            alt="프로필"
            width={56}
            height={56}
            className="order-2 rounded-xl border border-gray-200 object-cover md:order-1 md:w-[80px]"
          />
          {/* 텍스트 영역 */}
          <div className="order-1 ml-0 flex-1 md:order-2 md:ml-4">
            <div className="flex flex-col gap-y-1 md:flex-row md:items-center md:gap-1">
              <Image src={estimateIcon} alt={t("verifiedDriver")} className="h-5 w-4" />
              <div className="text-lg font-bold">
                {nickname} {t("driverSuffix")}
              </div>
            </div>
            <div className="max-w-[200px] truncate text-[12px] text-gray-500 md:min-w-[350px] md:text-[14px] lg:min-w-[500px]">
              {shortIntro}
            </div>
            <div className="hidden md:my-2 md:flex md:gap-2">
              <MoveTypeLabel type="small" />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between">
          <div className="mt-3 mb-2 flex w-full flex-col gap-y-3 md:flex-row md:gap-2">
            <div className="flex gap-3">
              <div className="text-[14px] md:text-[16px]">
                <div className="text-gray-500">{t("departure")}</div>
                <div className="text-black-500">
                  {locale === "ko" ? shortenRegionName(fromAddress.region) : fromAddress.region} {fromAddress.city}
                </div>
              </div>
              <div className="border-gray-100 text-[14px] md:border-r-2 md:px-3 md:text-[16px] lg:border-l-2">
                <div className="text-gray-500">{t("arrival")}</div>
                <div className="text-black-500">
                  {locale === "ko" ? shortenRegionName(toAddress.region) : toAddress.region} {toAddress.city}
                </div>
              </div>
            </div>

            <div className="border-gray-100 text-[14px] md:border-r-2 md:px-3 md:text-[16px] lg:border-r-0">
              <div className="text-gray-500">{t("moveDate")}</div>
              <div className="text-black-500">{formatDateByLanguage(moveDate, locale as "ko" | "en" | "zh")}</div>
            </div>
          </div>

          <div className="mt-4 flex min-w-[150px] items-center justify-between border-t-2 border-gray-200 pt-5 md:-mt-4 md:flex-col md:items-end md:border-none lg:hidden">
            <div className="font-medium text-gray-500">{t("estimateAmount")}</div>
            <div className="text-right text-2xl font-bold">
              {price.toLocaleString()} {shared("units.currency")}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-end">
        <div className="hidden lg:flex lg:flex-col lg:items-end">
          <div className="font-medium text-gray-500">{t("estimateAmount")}</div>
          <div className="text-right text-2xl font-bold">
            {price.toLocaleString()} {shared("units.currency")}
          </div>
        </div>
        <Button
          variant="solid"
          rounded="rounded-xl"
          className="bg-primary-400 w-full p-4 text-lg font-bold md:my-4 lg:px-10"
          onClick={onClickWrite}
        >
          {t("writeReviewButton")}
        </Button>
      </div>
    </div>
  );
};

export default WritableMoverCard;
