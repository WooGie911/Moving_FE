import React from "react";
import QuoteInfo from "./QuoteInfo";
import { EstimateListSection } from "./EstimateListSection";
import { IQuoteProps, mockestimateList } from "@/types/userQuote";

const QuoteInfo1: IQuoteProps = {
  movingType: "small",
  requestDate: "2025년 6월 24일",
  movingDate: "2025년 7월 8일(화)",
  startPoint: "서울시 중랑구 능동로 21길",
  endPoint: "경기도 수원시 팔달구 팔달로 123길",
};

export const QuoteAndEstimates = () => {
  return (
    <div className="border-border-light flex h-full w-full flex-col items-center justify-center gap-7 rounded-[20px] border-[0.5px] bg-gray-50 px-6 pt-8 pb-6 md:max-w-[768px] md:gap-10 md:px-7 md:pb-8 lg:max-w-[1120px] lg:flex-row lg:items-start lg:gap-15 lg:px-10 lg:pt-11 lg:pb-9">
      <QuoteInfo {...QuoteInfo1} />
      <EstimateListSection estimateList={mockestimateList} />
    </div>
  );
};
