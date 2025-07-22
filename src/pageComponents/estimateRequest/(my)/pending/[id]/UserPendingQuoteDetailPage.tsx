import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import { mockPendingQuoteResponses } from "@/types/customerEstimateRequest";
import React from "react";

const UserPendingQuoteDetailPage = () => {
  const estimateRequest = mockPendingQuoteResponses.estimateRequest;
  const estimate = mockPendingQuoteResponses.estimates[0];
  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate} type="pending" />
      </div>
    </>
  );
};

export default UserPendingQuoteDetailPage;
