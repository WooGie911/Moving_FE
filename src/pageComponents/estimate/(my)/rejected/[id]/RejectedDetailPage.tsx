import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { RejectDetailMain } from "@/components/estimate/(my)/rejected/[id]/RejectDetailMain";
import { DetailPageImgSection } from "@/components/quote/(my)/DetailPageImgSection";
import { mockMyRejectedEstimateData } from "@/types/moverEstimate";
import React from "react";
export const RejectedDetailPage = () => {
  const data = mockMyRejectedEstimateData[0];
  return (
    <div>
      <QuoteAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        {/* 견적 상세 정보 - 유저가 보낸 견적 중 내가 반려한 견적 */}

        <RejectDetailMain
          data={{
            id: data.estimateRequest.id,
            userId: data.estimateRequest.customerId,
            movingType: data.estimateRequest.moveType,
            movingDate: data.estimateRequest.moveDate,
            departureAddr: data.estimateRequest.fromAddress.city + " " + data.estimateRequest.fromAddress.district,
            arrivalAddr: data.estimateRequest.toAddress.city + " " + data.estimateRequest.toAddress.district,
            departureDetail: data.estimateRequest.fromAddress.detail || "",
            arrivalDetail: data.estimateRequest.toAddress.detail || "",
            description: data.estimateRequest.description || "",
            status: data.estimateRequest.status,
            createdAt: data.estimateRequest.createdAt,
            updatedAt: data.estimateRequest.updatedAt,
            user: {
              id: data.estimateRequest.customer.id,
              name: data.estimateRequest.customer.name,
              currentRole: "CUSTOMER",
              currentRegion: data.estimateRequest.customer.currentArea,
              profile: {
                nickname: data.estimateRequest.customer.nickname || "",
                profileImage: data.estimateRequest.customer.customerImage,
                introduction: "",
                description: "",
              },
            },
          }}
        />
      </div>
    </div>
  );
};
