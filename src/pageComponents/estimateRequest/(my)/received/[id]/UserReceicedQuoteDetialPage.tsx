import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import { mockReceivedQuoteListResponses } from "@/types/customerEstimateRequest";
import React from "react";

export const UserReceivedQuoteDetailPage = () => {
  const estimateRequest = mockReceivedQuoteListResponses[0].estimateRequest;
  const estimate = mockReceivedQuoteListResponses[0].estimates[1];

  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate} type="received" />
      </div>
    </>
  );
};
export default UserReceivedQuoteDetailPage;
