"use client";
import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { CardList } from "@/components/estimateRequest/(my)/CardList";
import { RequestQuote } from "@/components/estimateRequest/(my)/pending/RequestQuote";
import { mockPendingQuoteResponses, TMoverInfo } from "@/types/customerEstimateRequest";
import customerQuoteApi from "@/lib/api/customerEstimateRequest";
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
          movingType={data.estimateRequest.moveType.toLowerCase() as "small" | "home" | "office" | "document"}
          requestDate={data.estimateRequest.createdAt!.toLocaleDateString()}
          movingDate={data.estimateRequest.moveDate!.toLocaleDateString()}
          startPoint={shortenRegionInAddress(
            data.estimateRequest.fromAddress.city +
              " " +
              data.estimateRequest.fromAddress.district +
              " " +
              data.estimateRequest.fromAddress.detail,
          )}
          endPoint={shortenRegionInAddress(
            data.estimateRequest.toAddress.city +
              " " +
              data.estimateRequest.toAddress.district +
              " " +
              data.estimateRequest.toAddress.detail,
          )}
        />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {mockPendingQuoteResponses.estimates.map((item) => (
              <CardList
                key={item.id}
                mover={item.mover as TMoverInfo}
                isDesignated={false}
                estimateId={item.id}
                estimateState={item.status as "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED"}
                estimateTitle={item.comment || ""}
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
