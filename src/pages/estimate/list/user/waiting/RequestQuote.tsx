import React from "react";

interface RequestQuoteProps {
  movingType: string;
  requestDate: string;
  movingDate: string;
  startPoint: string;
  endPoint: string;
}

export const RequestQuote = ({ movingType, requestDate, movingDate, startPoint, endPoint }: RequestQuoteProps) => {
  return (
    <>
      <div className="flex w-full flex-col items-center justify-center gap-5 p-6 lg:flex-row lg:justify-between">
        <div className="flex w-full flex-col items-start justify-center">
          <h1 className="leading-2xl text-black-500 text-[20px] font-bold">{movingType}</h1>
          <p className="text-[12px] leading-[18px] font-normal text-gray-500">{`견적신청일: ${requestDate}`}</p>
        </div>

        <div className="flex w-full flex-col gap-1">
          <div className="flex flex-row justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">출발지</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold">{startPoint}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">도착지</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold">{endPoint}</p>
          </div>
          <div className="flex flex-row justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">이사일</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold">{movingDate}</p>
          </div>
        </div>
      </div>
    </>
  );
};
