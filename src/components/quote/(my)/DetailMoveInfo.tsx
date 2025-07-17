import { IQuoteProps } from "@/types/userQuote";
import React from "react";

export const DetailMoveInfo = ({
  movingType,
  requestDate,
  movingDate,
  startPoint,
  endPoint,
}: IQuoteProps & { movingType: "small" | "home" | "office" }) => {
  const movetype = { small: "소형이사", home: "가정이사", office: "사무실이사" };

  return (
    <div className="my-2 flex w-full flex-col items-start justify-center gap-7">
      <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">견적 정보</p>
      <div className="flex w-full flex-col items-start justify-center gap-3">
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">견적 요청일</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{requestDate}</p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">서비스</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">
            {movetype[movingType as keyof typeof movetype]}
          </p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">이용일</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{movingDate}</p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">출발지</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{startPoint}</p>
        </div>
        <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
          <p className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start">도착지</p>
          <p className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold">{endPoint}</p>
        </div>
      </div>
    </div>
  );
};
