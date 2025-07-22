import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import { mockPendingEstimateRequestResponses } from "@/types/customerEstimateRequest";
import React from "react";

const UserPendingEstimateRequestDetailPage = () => {
  const estimateRequest = mockPendingEstimateRequestResponses.estimateRequest;
  const estimate = mockPendingEstimateRequestResponses.estimates[0];
  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate} type="pending" />
      </div>
    </>
  );
};

export default UserPendingEstimateRequestDetailPage;
