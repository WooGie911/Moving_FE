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

  // movingType을 다국어로 변환하는 함수
  const getMovingTypeText = (type: string) => {
    const key = getMovingTypeKey(type.toLowerCase());
    return tMoveTypes(key);
  };

  return (
    <div className="flex w-full flex-col gap-4 rounded-[12px] bg-gray-50 p-6 md:gap-6 md:p-8">
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">
            {getMovingTypeText(movingType)}
          </h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatDateDot(createdAt)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("movingDate")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {formatDateWithDayAndTime(movingDate, weekdays, timeFormat)}
          </p>
        </div>
      </div>
      <div className="flex w-full flex-col gap-4 md:flex-row md:gap-6">
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("departure")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {departureAddr}
            {departureDetail && <br />}
            {departureDetail}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 md:w-1/2">
          <h3 className="text-[16px] leading-[26px] font-semibold text-gray-500 md:text-[18px]">{t("arrival")}</h3>
          <p className="text-[14px] leading-[22px] font-normal text-gray-400 md:text-[16px]">
            {arrivalAddr}
            {arrivalDetail && <br />}
            {arrivalDetail}
          </p>
        </div>
      </div>
    </div>
  );
};
