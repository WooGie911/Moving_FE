import { IEstimateRequest } from "@/types/customerEstimateRequest";
import React from "react";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";
import { useTranslations } from "next-intl";
import { getMovingTypeKey } from "@/lib/utils/getMovingTypeTranslated";

export const DetailMoveInfo = ({
  movingType,
  createdAt,
  movingDate,
  departureRegion,
  departureCity,
  departureDistrict,
  departureDetail,
  arrivalRegion,
  arrivalCity,
  arrivalDistrict,
  arrivalDetail,
}: IEstimateRequest) => {
  const t = useTranslations("customerEstimateRequest");
  const tShared = useTranslations();

  // 요일과 시간 포맷 가져오기
  const weekdays = [
    tShared("shared.time.weekdays.sunday"),
    tShared("shared.time.weekdays.monday"),
    tShared("shared.time.weekdays.tuesday"),
    tShared("shared.time.weekdays.wednesday"),
    tShared("shared.time.weekdays.thursday"),
    tShared("shared.time.weekdays.friday"),
    tShared("shared.time.weekdays.saturday"),
  ];
  const timeFormat = {
    am: tShared("shared.time.timeFormat.am"),
    pm: tShared("shared.time.timeFormat.pm"),
  };

  // movingType을 다국어로 변환하는 함수
  const getMovingTypeText = (type: string) => {
    const key = getMovingTypeKey(type.toLowerCase());
    return t(`movingTypes.${key}`);
  };

  return (
    <section
      className="my-2 flex w-full flex-col items-start justify-center gap-7"
      aria-labelledby="estimate-info-heading"
    >
      <h2
        id="estimate-info-heading"
        className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"
      >
        {t("estimateInfo")}
      </h2>
      <dl className="flex w-full flex-col items-start justify-center gap-3">
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <dt
            className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
            aria-label={t("requestDateShort")}
          >
            {t("requestDateShort")}
          </dt>
          <dd
            className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
            aria-label={`${t("requestDateShort")}: ${formatDateDot(createdAt)}`}
          >
            {formatDateDot(createdAt)}
          </dd>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <dt
            className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
            aria-label={t("service")}
          >
            {t("service")}
          </dt>
          <dd
            className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
            aria-label={`${t("service")}: ${getMovingTypeText(movingType)}`}
          >
            {getMovingTypeText(movingType)}
          </dd>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <dt
            className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
            aria-label={t("usageDate")}
          >
            {t("usageDate")}
          </dt>
          <dd
            className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
            aria-label={`${t("usageDate")}: ${formatDateWithDayAndTime(movingDate, weekdays, timeFormat)}`}
          >
            {formatDateWithDayAndTime(movingDate, weekdays, timeFormat)}
          </dd>
        </div>
        <div className="flex w-full flex-row items-start justify-between md:justify-start md:gap-6">
          <dt
            className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
            aria-label={t("departure")}
          >
            {t("departure")}
          </dt>
          <dd
            className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
            aria-label={`${t("departure")}: ${departureRegion} ${departureCity} ${departureDistrict} ${departureDetail}`}
          >
            <span className="md:hidden">
              <span className="block text-right">
                {departureRegion} {departureCity}
              </span>
              <span className="block text-right">{departureDistrict}</span>
              <span className="block text-right">{departureDetail}</span>
            </span>
            <span className="hidden md:inline">
              {departureRegion} {departureCity} {departureDistrict} {departureDetail}
            </span>
          </dd>
        </div>
        <div className="flex w-full flex-row items-start justify-between md:justify-start md:gap-6">
          <dt
            className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
            aria-label={t("arrival")}
          >
            {t("arrival")}
          </dt>
          <dd
            className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
            aria-label={`${t("arrival")}: ${arrivalRegion} ${arrivalCity} ${arrivalDistrict} ${arrivalDetail}`}
          >
            <span className="md:hidden">
              <span className="block text-right">
                {arrivalRegion} {arrivalCity}
              </span>
              <span className="block text-right">{arrivalDistrict}</span>
              <span className="block text-right">{arrivalDetail}</span>
            </span>
            <span className="hidden md:inline">
              {arrivalRegion} {arrivalCity} {arrivalDistrict} {arrivalDetail}
            </span>
          </dd>
        </div>
      </dl>
    </section>
  );
};
