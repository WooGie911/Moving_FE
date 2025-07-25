"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export const UserReceivedEstimateRequestDetailPage = () => {
  const { id: estimateId } = useParams(); // id는 estimateId
  const { data, isPending, isError } = useQuery({
    queryKey: ["estimateRequest"],
    queryFn: () => customerEstimateRequestApi.getReceivedEstimateRequests(),
  });

  if (isPending) return <div>로딩 중...</div>;
  if (isError) {
    console.error("API 에러:", isError);
    return <div>에러가 발생했습니다. 다시 시도해주세요. </div>;
  }
  if (!data) return <div>데이터를 불러올 수 없습니다.</div>;

  let foundEstimateRequest = null;
  let foundEstimate = null;

  for (const item of data) {
    const match = item.estimates.find((est) => est.id === estimateId);
    if (match) {
      foundEstimateRequest = item.estimateRequest;
      foundEstimate = match;
      break;
    }
  }

  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={foundEstimateRequest!} estimate={foundEstimate!} type="received" />
      </div>
    </>
  );
};
export default UserReceivedEstimateRequestDetailPage;
