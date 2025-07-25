"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimate/CardList";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { mockMyRejectedEstimateData } from "@/types/moverEstimate";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const RejectedPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["MyRejectedEstimates"],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(),
  });

  // 로딩 상태
  if (isPending) {
    return <div>로딩 중...</div>;
  }

  // 에러 상태
  if (isError) {
    console.error("API 에러:", error);
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }

  // 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <div>
        <EstimateRequestAndEstimateTab userType="Mover" />
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
          <div className="flex w-full flex-col items-center justify-center">
            <div className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
              <div className="text-center">
                <p className="mb-2 text-lg font-medium text-gray-600">반려한 견적이 없습니다</p>
                <p className="text-sm text-gray-500">반려한 견적이 없습니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Mover" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {data.map((item: any) => (
              <CardList
                key={item.id}
                data={item.estimateRequest}
                id={item.id}
                isDesignated={item.isDesignated}
                type="rejected"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
