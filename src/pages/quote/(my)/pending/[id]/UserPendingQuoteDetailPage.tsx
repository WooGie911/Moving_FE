import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/quote/(my)/DetailPageMainSeaction";
import { data1 } from "@/types/userQuote";
import React from "react";

export const UserPendingQuoteDetailPage = () => {
  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction data={data1} />
      </div>
    </>
  );
};
export default UserPendingQuoteDetailPage;
