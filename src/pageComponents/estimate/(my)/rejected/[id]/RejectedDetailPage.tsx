"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RejectDetailMain } from "@/components/estimate/(my)/rejected/[id]/RejectDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { mockMyRejectedEstimateData } from "@/types/moverEstimate";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

export const RejectedDetailPage = () => {
  const { id } = useParams(); // 이렇게 해야 실제 URL 파라미터와 일치
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["MyRejectedEstimate"],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(),
  });

  if (isPending) {
    return <div>로딩 중...</div>;
  }
  if (isError) {
    console.error("API 에러:", error);
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }

  // data에서 estimateRequestId와 일치하는 항목 찾기
  const mydata = Array.isArray(data) ? data.find((item: any) => item.id === id) : null;

  if (!mydata) {
    return <div>해당 견적을 찾을 수 없습니다.</div>;
  }

  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <RejectDetailMain data={mydata.estimateRequest} />
      </div>
    </div>
  );
};
