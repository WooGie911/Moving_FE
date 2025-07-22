import React from "react";
import QuoteInfo from "./QuoteInfo";
import { EstimateListSection } from "./EstimateListSection";
import { TReceivedQuoteResponse } from "@/types/customerEstimateRequest";
import { TEstimateRequestResponse } from "@/types/customerEstimateRequest";

export const QuoteAndEstimates = ({ estimateRequest, estimates }: TReceivedQuoteResponse) => {
  const cardListData = estimates.map((estimate) => ({
    isDesignated: estimate.isDesignated,
    estimateId: estimate.id,
    estimateState: estimate.status as "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED",
    estimateTitle: estimate.comment || "",
    estimatePrice: estimate.price,
    mover: estimate.mover,
    type: "received" as const,
  }));

  return (
    <div className="border-border-light flex h-full w-full flex-col items-center justify-center gap-7 rounded-[20px] border-[0.5px] bg-gray-50 px-6 pt-8 pb-6 md:max-w-[768px] md:gap-10 md:px-7 md:pb-8 lg:max-w-[1120px] lg:flex-row lg:items-start lg:gap-15 lg:px-10 lg:pt-11 lg:pb-9">
      <QuoteInfo {...estimateRequest} />
      <EstimateListSection estimateList={cardListData} />
    </div>
  );
};
