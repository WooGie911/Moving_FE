import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import { mockReceivedEstimateRequestListResponses } from "@/types/customerEstimateRequest";
import React from "react";

export const UserReceivedEstimateRequestDetailPage = () => {
  const estimateRequest = mockReceivedEstimateRequestListResponses[0].estimateRequest;
  const estimate = mockReceivedEstimateRequestListResponses[0].estimates[1];

  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate} type="received" />
      </div>
    </>
  );
};
export default UserReceivedEstimateRequestDetailPage;
