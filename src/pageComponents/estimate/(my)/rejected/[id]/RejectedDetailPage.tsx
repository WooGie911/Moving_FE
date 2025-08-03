"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RejectDetailMain } from "@/components/estimate/(my)/rejected/[id]/RejectDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export const RejectedDetailPage = () => {
  const t = useTranslations("estimate");
  const commonT = useTranslations("common");
  const { id } = useParams(); // 이렇게 해야 실제 URL 파라미터와 일치
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["MyRejectedEstimate"],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(),
  });

  if (isPending) {
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  }
  if (isError) {
    console.error(`${t("apiError")}`, error);
    return <div>{t("common.error")}</div>;
  }

  // data에서 estimateRequestId와 일치하는 항목 찾기
  const mydata = Array.isArray(data) ? data.find((item: any) => item.id === id) : null;

  if (!mydata) {
    return <div>{t("estimateNotFound")}</div>;
  }

  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <RejectDetailMain data={mydata.estimateRequest} />
      </div>
    </div>
  );
};
