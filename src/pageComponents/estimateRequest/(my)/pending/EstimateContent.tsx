"use client";

import React from "react";
import Image from "next/image";
import { CardList } from "@/components/estimateRequest/(my)/CardList";
import { RequestEstimateRequest } from "@/components/estimateRequest/(my)/pending/RequestEstimateRequest";
import noEstimate from "@/assets/img/etc/noEstimate.webp";
import { TPendingEstimateRequestResponse } from "@/types/customerEstimateRequest";

interface EstimateContentProps {
  data: TPendingEstimateRequestResponse;
  t: any;
  commonT: any;
  mapServiceTypeToMoveType: (moveType: string) => string;
}

export const EstimateContent = ({ data, t, commonT, mapServiceTypeToMoveType }: EstimateContentProps) => {
  const estimateRequest = data.estimateRequest;
  const estimates = data.estimates ?? [];

  // estimates 배열에서 ACCEPTED 상태인 견적이 있는지 확인
  const hasConfirmedEstimate = estimates.some((estimate) => estimate.status === "ACCEPTED");

  return (
    <>
      {estimateRequest && (
        <RequestEstimateRequest
          moveType={mapServiceTypeToMoveType(estimateRequest.moveType)}
          createdAt={estimateRequest.createdAt}
          moveDate={estimateRequest.moveDate}
          fromAddress={estimateRequest.fromAddress}
          toAddress={estimateRequest.toAddress}
        />
      )}
      <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
        {estimates.length === 0 ? (
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={noEstimate} alt="empty-estimateRequest" fill className="object-contain" priority />
            </div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("moversReviewing")}</div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("estimateComingSoon")}</div>
          </div>
        ) : (
          <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {estimates.map((item) => (
              <CardList
                key={item.id}
                estimateRequest={estimateRequest}
                estimate={item}
                usedAt="pending"
                hasConfirmedEstimate={hasConfirmedEstimate}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};
