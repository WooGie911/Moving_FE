import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RequestDetailMain } from "@/components/estimate/(my)/request/[id]/RequestDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { mockMyEstimateData } from "@/types/moverEstimate";
import React from "react";
export const RequsetDetailPage = () => {
  const data = mockMyEstimateData[0];
  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        {/* 견적 상세 정보 - 기사가 보낸 견적서 */}
        <RequestDetailMain data={data} />
      </div>
    </div>
  );
};
