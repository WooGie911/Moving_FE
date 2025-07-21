import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { RejectDetailMain } from "@/components/estimate/(my)/rejected/[id]/RejectDetailMain";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { mockQuoteResponseData } from "@/types/moverEstimate";
import React from "react";
export const RejectedDetailPage = () => {
  const data = mockQuoteResponseData[0];
  return (
    <div>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        {/* 견적 상세 정보 - 유저가 보낸 견적 중 내가 반려한 견적 */}

        <RejectDetailMain data={data} />
      </div>
    </div>
  );
};
