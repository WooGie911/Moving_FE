"use client";
import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { CardList } from "@/components/quote/(my)/CardList";
import { RequestQuote } from "@/components/quote/(my)/pending/RequestQuote";
import { mockPendingQuoteResponses, TMoverInfo } from "@/types/customerEstimateRequest";
import customerQuoteApi from "@/lib/api/customerEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useAuth } from "@/providers/AuthProvider";
import { getTokenFromCookie } from "@/utils/auth";
import Image from "next/image";
import noEstimate from "@/assets/img/etc/noEstimate.png";
// Date 객체를 한국어 날짜 형식으로 변환하는 함수
const formatKoreanDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}년 ${month}월 ${day}일`;
};

export const UserPendingQuotePage = () => {
  const datas = mockPendingQuoteResponses;
  const { user } = useAuth();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pendingQuotes"],
    queryFn: () => customerQuoteApi.getPendingQuote(),
  });
  console.log("넘어온데이터:", data);
  console.log("목데이터:", datas);

  useEffect(() => {
    const checkUserId = async () => {
      const token = await getTokenFromCookie();
      const payload = JSON.parse(atob(token!.split(".")[1]));
      console.log("프론트 userId:", payload.userId);
    };
    checkUserId();
  }, []);

  if (isPending) return <div>로딩 중...</div>; // 또는 로딩 스피너 컴포넌트
  if (!data) return null;

  const createdAt = new Date(data.estimateRequest.createdAt);
  const movingDate = new Date(data.estimateRequest.moveDate);

  const formatKoreanDateWithParen = (date: Date) => {
    const dateStr = date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const weekday = date.toLocaleDateString("ko-KR", { weekday: "short" });
    return `${dateStr} (${weekday})`;
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <QuoteAndEstimateTab userType="User" />
        <RequestQuote
          movingType={data.estimateRequest.moveType.toLowerCase() as "small" | "home" | "office" | "document"}
          requestDate={formatKoreanDateWithParen(createdAt)}
          movingDate={formatKoreanDateWithParen(movingDate)}
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
          {data.estimates.length === 0 ? (
            <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
              <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
                <Image src={noEstimate} alt="empty-quote" fill className="object-contain" />
              </div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">기사님들이 열심히 확인중이예요.</div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">곧 견적이 도착할 거예요.</div>
            </div>
          ) : (
            <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
              {data.estimates.map((item) => (
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
          )}
        </div>
      </div>
    </>
  );
};
export default UserPendingQuotePage;
