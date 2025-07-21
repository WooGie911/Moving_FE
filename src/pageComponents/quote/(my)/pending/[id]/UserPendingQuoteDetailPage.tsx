import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/quote/(my)/DetailPageMainSeaction";
import { mockPendingQuoteResponses } from "@/types/userQuote";
import React from "react";

const UserPendingQuoteDetailPage = () => {
  const quote = mockPendingQuoteResponses.quote;
  const estimate = mockPendingQuoteResponses.estimates[0];
  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction quote={quote} estimate={estimate} type="pending" />
      </div>
    </>
  );
};

export default UserPendingQuoteDetailPage;
