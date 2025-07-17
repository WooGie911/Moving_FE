import React from "react";
import QuoteInfo from "./QuoteInfo";
import { EstimateListSection } from "./EstimateListSection";
import { IReceivedQuoteResponse } from "@/types/userQuote";

export const QuoteAndEstimates = ({ quote, estimates }: IReceivedQuoteResponse) => {
  // IEstimate를 ICardListProps로 변환
  const cardListData = estimates.map((estimate) => ({
    movingType: quote.movingType.toLowerCase() as "small" | "home" | "office" | "document",
    isDesignated: estimate.isDesignated,
    estimateId: estimate.id,
    estimateState: estimate.status,
    estimateTitle: estimate.description,
    estimatePrice: estimate.price,
    mover: {
      ...estimate.mover,
      currentRole: estimate.mover.currentRole as "CUSTOMER" | "MOVER",
      profile: estimate.mover.profile || {
        nickname: "",
        profileImage: null,
        experience: 0,
        introduction: "",
        description: "",
        completedCount: 0,
        avgRating: 0,
        reviewCount: 0,
        favoriteCount: 0,
      },
    },
    type: "received" as const,
  }));

  return (
    <div className="border-border-light flex h-full w-full flex-col items-center justify-center gap-7 rounded-[20px] border-[0.5px] bg-gray-50 px-6 pt-8 pb-6 md:max-w-[768px] md:gap-10 md:px-7 md:pb-8 lg:max-w-[1120px] lg:flex-row lg:items-start lg:gap-15 lg:px-10 lg:pt-11 lg:pb-9">
      <QuoteInfo {...quote} />
      <EstimateListSection estimateList={cardListData} />
    </div>
  );
};
