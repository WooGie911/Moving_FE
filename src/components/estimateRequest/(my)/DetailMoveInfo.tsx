import { IEstimateRequest } from "@/types/customerEstimateRequest";
import React from "react";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";
import { useTranslations } from "next-intl";
import { getMovingTypeKey } from "@/lib/utils/getMovingTypeTranslated";

export const DetailMoveInfo = ({
  movingType,
  createdAt,
  movingDate,
  departureAddr,
  arrivalAddr,
  departureDetail,
  arrivalDetail,
}: IEstimateRequest) => {
  const t = useTranslations("estimateRequest");
  const tShared = useTranslations();
  const tMoveTypes = useTranslations("moveTypes");

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
    return tMoveTypes(key);
  };

  return (
    <div className="my-2 flex w-full flex-col items-start justify-center gap-7">
      <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
        {t("estimateInfo")}
      </p>
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("requestDateShort")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {formatDateDot(createdAt)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("service")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {getMovingTypeText(movingType)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("usageDate")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {formatDateWithDayAndTime(movingDate, weekdays, timeFormat)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("departure")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {departureAddr + " " + departureDetail}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("arrival")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {arrivalAddr + " " + arrivalDetail}
          </p>
        </div>
      </div>
    </div>
  );
};
