import React from "react";

interface IRequestQuoteProps {
  movingType: string;
  requestDate: string;
  movingDate: string;
  startPoint: string;
  endPoint: string;
}

export const RequestQuote = ({ movingType, requestDate, movingDate, startPoint, endPoint }: IRequestQuoteProps) => {
  return (
    <>
      <div className="flex w-full max-w-300 flex-col items-center justify-center gap-5 p-6 md:px-18 md:py-8 lg:flex-row lg:justify-between lg:px-0">
        <div className="flex w-full flex-col items-start justify-center">
          <h1 className="leading-2xl text-black-500 text-[20px] font-bold md:text-[24px]">{movingType}</h1>
          <p className="md:leading-[24 px] text-[12px] leading-[18px] font-normal text-gray-500 md:text-[14px]">{`견적신청일: ${requestDate}`}</p>
        </div>

        <div className="flex w-full flex-col gap-1 md:flex-row md:justify-end md:gap-3">
          <div className="flex flex-row justify-between md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">출발지</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {startPoint}
            </p>
          </div>
          <div className="hidden md:flex md:flex-col md:items-end md:justify-end">
            <p className="text-black-500 text-[14px] leading-6 font-semibold">{"->"}</p>
          </div>
          <div className="flex flex-row justify-between md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">도착지</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {endPoint}
            </p>
          </div>
          <div className="flex flex-row justify-between md:ml-7 md:flex-col">
            <p className="text-[14px] leading-6 font-normal text-gray-500">이사일</p>
            <p className="text-black-500 text-[14px] leading-6 font-semibold md:text-[18px] md:leading-[26px]">
              {movingDate}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
