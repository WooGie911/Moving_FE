import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/quote/(my)/DetailPageMainSeaction";
import { ShareSection } from "@/components/quote/(my)/ShareSection";
import { mover1 } from "@/types/userQuote";
import React from "react";

export const UserReceivedQuoteDetailPage = () => {
  return (
    <>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction
          moveType="home"
          isDesignated={true}
          estimateId="1234567890"
          estimateState="PENDING"
          estimateTitle="고궹님의 물품을 안전스하게 운송해 드립니다."
          estimatePrice={100000}
          mover={mover1}
          type="received"
        />
      </div>
    </>
  );
};
export default UserReceivedQuoteDetailPage;
