import { IEstimateRequest } from "@/types/customerEstimateRequest";
import React from "react";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";
import { useTranslations } from "next-intl";
import { getMovingTypeText, createAddressDisplay } from "@/utils/estimateRequestUtils";

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
  const tMoveTypes = useTranslations("moveTypes");

  // 요일과 시간 포맷 가져오기
  const weekdays = [
    t("weekdays.sunday"),
    t("weekdays.monday"),
    t("weekdays.tuesday"),
    t("weekdays.wednesday"),
    t("weekdays.thursday"),
    t("weekdays.friday"),
    t("weekdays.saturday"),
  ];
  const timeFormat = {
    am: t("timeFormat.am"),
    pm: t("timeFormat.pm"),
  };

  // 주소 표시 생성
  const departureDisplay = createAddressDisplay(departureAddr, departureDetail);
  const arrivalDisplay = createAddressDisplay(arrivalAddr, arrivalDetail);

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
            {getMovingTypeText(movingType, tMoveTypes)}
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
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{departureDisplay}</p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">
            {t("arrival")}
          </p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{arrivalDisplay}</p>
        </div>
      </div>
    </div>
  );
};
