"use client";
import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { CardList } from "@/components/quote/(my)/CardList";
import { RequestQuote } from "@/components/quote/(my)/pending/RequestQuote";
import customerQuoteApi from "@/lib/api/customerQuote";
import { mover1 } from "@/types/userQuote";
import { useQuery } from "@tanstack/react-query";
import React from "react";

export const UserPendingQuotePage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pendingQuotes"],
    queryFn: () => customerQuoteApi.getPendingQuote(),
  });

  console.log("=== 쿼리 상태 ===");
  console.log("isPending:", isPending);
  console.log("isError:", isError);
  console.log("error:", error);
  console.log("data:", data);
  console.log("==================");
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <QuoteAndEstimateTab userType="User" />
        <RequestQuote
          movingType="소형이사"
          requestDate="2025년 6월 24일"
          movingDate="2025년 7월 8일(화)"
          startPoint="서울시 중랑구"
          endPoint="경기도 수원시"
        />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            <CardList
              movingType="office"
              isDesignated={true}
              estimateId="0"
              estimateState="PENDING"
              estimateTitle="사무실 이사전문 김코드"
              estimatePrice={170000}
              type="pending"
              mover={mover1}
            />
            <CardList
              movingType="home"
              isDesignated={true}
              estimateId="1"
              estimateState="PENDING"
              estimateTitle="예시 견적서 1"
              estimatePrice={170000}
              type="pending"
              mover={mover1}
            />
            <CardList
              movingType="small"
              isDesignated={false}
              estimateId="2"
              estimateState="PENDING"
              estimateTitle="예시 견적서 2"
              estimatePrice={100000}
              type="pending"
              mover={mover1}
            />

            <CardList
              movingType="small"
              isDesignated={false}
              estimateId="3"
              estimateState="PENDING"
              estimateTitle="예시 견적서 3"
              estimatePrice={100000}
              type="pending"
              mover={mover1}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default UserPendingQuotePage;
