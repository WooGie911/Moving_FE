import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/quote/(my)/DetailPageMainSeaction";
import { mockReceivedQuoteListResponses } from "@/types/userQuote";
import React from "react";

export const UserReceivedQuoteDetailPage = () => {
  const quote = mockReceivedQuoteListResponses[0].quote;
  const estimate = mockReceivedQuoteListResponses[0].estimates[1];

  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction quote={quote} estimate={estimate} type="received" />
      </div>
    </>
  );
};
export default UserReceivedQuoteDetailPage;
