"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimateRequest/(my)/CardList";
import { RequestEstimateRequest } from "@/components/estimateRequest/(my)/pending/RequestEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import Image from "next/image";
import noEstimate from "@/assets/img/etc/noEstimate.png";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { TMoverInfo } from "@/types/customerEstimateRequest";

export const UserPendingEstimateRequestPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["pendingEstimateRequests"],
    queryFn: () => customerEstimateRequestApi.getPendingEstimateRequest(),
  });

  if (isPending) return <div>로딩 중...</div>; // 또는 로딩 스피너 컴포넌트
  if (isError) return <div>에러가 발생했습니다.</div>;

  if (!data || data.estimateRequest === null) {
    return (
      <div className="flex flex-col items-center justify-center">
        <EstimateRequestAndEstimateTab userType="User" />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={noEstimate} alt="empty-estimateRequest" fill className="object-contain" />
            </div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">진행중인 견적이 없습니다.</div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">새로운 견적을 요청해보세요.</div>
            <Link href="/estimateRequest/create">
              <Button
                variant="solid"
                state="default"
                width="w-[287px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                className="mt-4"
              >
                견적 작성하러가기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estimateRequest = data.estimateRequest;
  const estimates = data.estimates ?? [];

  // estimateRequest가 null이 아님을 타입가드로 보장
  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <EstimateRequestAndEstimateTab userType="User" />
        {estimateRequest && (
          <RequestEstimateRequest
            movingType={estimateRequest.moveType.toLowerCase() as "small" | "home" | "office" | "document"}
            requestDate={
              typeof estimateRequest.createdAt === "string"
                ? estimateRequest.createdAt
                : estimateRequest.createdAt.toISOString()
            }
            movingDate={
              typeof estimateRequest.moveDate === "string"
                ? estimateRequest.moveDate
                : estimateRequest.moveDate.toISOString()
            }
            startPoint={shortenRegionInAddress(
              shortenRegionInAddress(estimateRequest.fromAddress.region) +
                " " +
                estimateRequest.fromAddress.city +
                " " +
                estimateRequest.fromAddress.district +
                " " +
                estimateRequest.fromAddress.detail,
            )}
            endPoint={shortenRegionInAddress(
              shortenRegionInAddress(estimateRequest.toAddress.region) +
                " " +
                estimateRequest.toAddress.city +
                " " +
                estimateRequest.toAddress.district +
                " " +
                estimateRequest.toAddress.detail,
            )}
          />
        )}
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          {estimates.length === 0 ? (
            <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
              <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
                <Image src={noEstimate} alt="empty-estimateRequest" fill className="object-contain" />
              </div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">기사님들이 열심히 확인중이예요.</div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">곧 견적이 도착할 거예요.</div>
            </div>
          ) : (
            <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
              {estimates.map((item) => (
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
export default UserPendingEstimateRequestPage;
