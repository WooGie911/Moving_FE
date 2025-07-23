"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest";
import { mockPendingEstimateRequestResponses } from "@/types/customerEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";

const UserPendingEstimateRequestDetailPage = () => {
  const { id } = useParams();

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pendingQuotes"],
    queryFn: () => customerEstimateRequestApi.getPendingEstimateRequest(),
  });

  if (isPending) return <div>로딩 중...</div>; // 또는 로딩 스피너 컴포넌트
  if (isError) return <div>에러가 발생했습니다.</div>;

  const estimateRequest = data!.estimateRequest;
  const estimate = data!.estimates.find((estimate) => estimate.id === id);
  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate!} type="pending" />
      </div>
    </>
  );
};

export default UserPendingEstimateRequestDetailPage;
