"use client";
import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { CardList } from "@/components/quote/(my)/CardList";
import { RequestQuote } from "@/components/quote/(my)/pending/RequestQuote";
import { mockPendingQuoteResponses, TMover } from "@/types/userQuote";
import customerQuoteApi from "@/lib/api/customerQuote";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { shortenRegionInAddress } from "@/utils/regionMapping";

// Date 객체를 한국어 날짜 형식으로 변환하는 함수
const formatKoreanDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const UserPendingQuotePage = () => {
  const data = mockPendingQuoteResponses;
  // const { data, isPending, isError, error } = useQuery({
  //   queryKey: ["pendingQuotes"],
  //   queryFn: () => customerQuoteApi.getPendingQuote(),
  // });

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <QuoteAndEstimateTab userType="User" />
        <RequestQuote
          movingType={data.quote.movingType.toLowerCase() as "small" | "home" | "office" | "document"}
          requestDate={data.quote.createdAt!.toLocaleDateString()}
          movingDate={data.quote.movingDate!.toLocaleDateString()}
          startPoint={shortenRegionInAddress(data.quote.departureAddr.split(" ").slice(0, 2).join(" "))}
          endPoint={shortenRegionInAddress(data.quote.arrivalAddr.split(" ").slice(0, 2).join(" "))}
        />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {mockPendingQuoteResponses.estimates.map((item) => (
              <CardList
                key={item.id}
                mover={item.mover as TMover}
                isDesignated={false}
                estimateId={item.id}
                estimateState={item.status}
                estimateTitle={item.description}
                estimatePrice={item.price}
                type="pending"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default UserPendingQuotePage;
