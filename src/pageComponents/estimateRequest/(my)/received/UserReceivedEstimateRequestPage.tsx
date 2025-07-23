import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { EstimateRequestAndEstimates } from "@/components/estimateRequest/(my)/received/EstimateRequestAndEstimates";
import { mockReceivedEstimateRequestListResponses } from "@/types/customerEstimateRequest";
import React from "react";

const UserReceivedEstimateRequestPage = () => {
  const data = mockReceivedEstimateRequestListResponses;
  return (
    <>
      <EstimateRequestAndEstimateTab userType="User" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
        {data.map((item) => (
          <EstimateRequestAndEstimates key={item.estimateRequest.id} {...item} />
        ))}
      </div>
    </>
  );
};

export default UserReceivedEstimateRequestPage;
