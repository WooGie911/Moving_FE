"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { EstimateRequestAndEstimates } from "@/components/estimateRequest/(my)/received/EstimateRequestAndEstimates";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest";
import { mockReceivedEstimateRequestListResponses } from "@/types/customerEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import notfound from "@/assets/img/mascot/notfound.png";

const UserReceivedEstimateRequestPage = () => {
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

  // 완료된 견적 요청이 없는 경우
  if (data.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <EstimateRequestAndEstimateTab userType="User" />
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
            <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
              <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
                <Image src={notfound} alt="empty-estimateRequest" fill className="object-contain" />
              </div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">과거 받았던 견적이 없습니다.</div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">
                이사를 완료하면 견적 내역을 확인할 수 있습니다.
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
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
