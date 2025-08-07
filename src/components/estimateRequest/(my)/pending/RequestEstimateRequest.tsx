import { IEstimateRequestProps } from "@/types/customerEstimateRequest";
import React from "react";
import arrow from "@/assets/icon/arrow/icon-arrow.svg";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { getMovingTypeKey } from "@/lib/utils/getMovingTypeTranslated";
import { formatDateWithDay, getMovingDateFormatKeys } from "@/lib/utils/dateFormatUtils";

export const RequestEstimateRequest = ({
  moveType,
  createdAt,
  moveDate,
  fromAddress,
  toAddress,
}: IEstimateRequestProps) => {
  const t = useTranslations("estimateRequest");
  const tShared = useTranslations();
  const tMoveTypes = useTranslations("moveTypes");
  const locale = useLocale();

  // movingType을 다국어로 변환하는 함수
  const getMovingTypeTranslated = (movingType: string): string => {
    const key = getMovingTypeKey(movingType);
    return tMoveTypes(key);
  };

  // 이사일: 다국어 날짜 포맷
  const formatDateWithDayTranslated = (dateStr: Date) => {
    const formatKeys = getMovingDateFormatKeys();
    const weekdays = [
      t(formatKeys.weekdays.sunday),
      t(formatKeys.weekdays.monday),
      t(formatKeys.weekdays.tuesday),
      t(formatKeys.weekdays.wednesday),
      t(formatKeys.weekdays.thursday),
      t(formatKeys.weekdays.friday),
      t(formatKeys.weekdays.saturday),
    ];

    const yearSuffix = t(formatKeys.year);
    const monthSuffix = t(formatKeys.month);
    const daySuffix = t(formatKeys.day);

    return formatDateWithDay(dateStr, yearSuffix, monthSuffix, daySuffix, weekdays);
  };

  return (
    <article
      className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-5 p-6 md:px-18 md:py-8 lg:mx-auto lg:flex-row"
      aria-label={t("aria.estimateRequestCard")}
    >
      <header
        className="flex w-full flex-row items-center justify-between"
        aria-label={t("aria.estimateRequestHeader")}
      >
        <div className="flex w-full flex-col items-start justify-center">
          <h1
            className="leading-2xl text-black-500 text-[20px] font-bold md:text-[24px]"
            aria-label={t("aria.estimateRequestTitle")}
          >
            {getMovingTypeTranslated(moveType)}
          </h1>
          <p
            className="md:leading-[24 px] text-[12px] leading-[18px] font-normal text-gray-500 md:text-[14px]"
            aria-label={`${t("aria.estimateRequestDate")} ${formatDateWithDayTranslated(createdAt)}`}
          >
            {`${t("requestDate")} ${formatDateWithDayTranslated(createdAt)}`}
          </p>
        </div>
      </header>

      <section
        className="flex w-full flex-col gap-1 md:flex-row md:justify-start md:gap-3"
        aria-label={t("aria.estimateRequestRoute")}
      >
        <div
          className="flex flex-row justify-between md:flex-col"
          role="region"
          aria-label={t("aria.estimateRequestDeparture")}
        >
          <p className="text-[14px] leading-6 font-normal text-gray-500">{t("departure")}</p>
          <p
            className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]"
            aria-label={`${t("departure")}: ${locale === "ko" ? shortenRegionInAddress(fromAddress.region) : fromAddress.region} ${fromAddress.city}`}
          >
            {locale === "ko" ? shortenRegionInAddress(fromAddress.region) : fromAddress.region} {fromAddress.city}
          </p>
        </div>

        <div
          className="hidden md:flex md:items-end md:justify-end"
          role="presentation"
          aria-hidden="true"
          aria-label={t("aria.estimateRequestArrow")}
        >
          <Image src={arrow} alt="" width={16} height={16} className="object-cover" aria-hidden="true" />
        </div>

        <div
          className="flex flex-row justify-between md:flex-col"
          role="region"
          aria-label={t("aria.estimateRequestArrival")}
        >
          <p className="text-[14px] leading-6 font-normal text-gray-500">{t("arrival")}</p>
          <p
            className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]"
            aria-label={`${t("arrival")}: ${locale === "ko" ? shortenRegionInAddress(toAddress.region) : toAddress.region} ${toAddress.city}`}
          >
            {locale === "ko" ? shortenRegionInAddress(toAddress.region) : toAddress.region} {toAddress.city}
          </p>
        </div>

        <div
          className="flex flex-row justify-between md:ml-7 md:flex-col"
          role="region"
          aria-label={t("aria.estimateRequestMovingDate")}
        >
          <p className="text-[14px] leading-6 font-normal text-gray-500">{t("movingDate")}</p>
          <p
            className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]"
            aria-label={`${t("movingDate")}: ${formatDateWithDayTranslated(moveDate)}`}
          >
            {formatDateWithDayTranslated(moveDate)}
          </p>
        </div>
      </section>
    </article>
  );
};
