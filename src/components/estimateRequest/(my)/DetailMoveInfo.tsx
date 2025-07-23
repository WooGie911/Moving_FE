import { IEstimateRequest } from "@/types/customerEstimateRequest";
import React from "react";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";

export const DetailMoveInfo = ({
  movingType,
  createdAt,
  movingDate,
  departureAddr,
  arrivalAddr,
  departureDetail,
  arrivalDetail,
}: IEstimateRequest) => {
  // movingType을 한글로 변환하는 함수
  const getMovingTypeText = (type: string) => {
    switch (type.toLowerCase()) {
      case "small":
        return "소형이사";
      case "home":
        return "가정이사";
      case "office":
        return "사무실이사";
      default:
        return type;
    }
  };

  return (
    <div className="my-2 flex w-full flex-col items-start justify-center gap-7">
      <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">견적 정보</p>
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">견적 요청일</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {formatDateDot(createdAt)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">서비스</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {getMovingTypeText(movingType)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">이용일</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {formatDateWithDayAndTime(movingDate)}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">출발지</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {departureAddr + " " + departureDetail}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">도착지</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {arrivalAddr + " " + arrivalDetail}
          </p>
        </div>
      </div>
    </div>
  );
};
