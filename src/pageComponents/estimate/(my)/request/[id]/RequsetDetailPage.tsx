"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RequestDetailMain } from "@/components/estimate/(my)/request/[id]/RequestDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { mockMyEstimateData } from "@/types/moverEstimate";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslations } from "next-intl";
export const RequsetDetailPage = () => {
  const t = useTranslations("estimate");
  const { id: estimateId } = useParams();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["MyEstimates"],
    queryFn: () => moverEstimateApi.getMyEstimates(),
  });
  if (isPending) {
    return <div>{t("loading")}</div>;
  }
  if (isError) {
    console.error(`${t("apiError")}`, error);
    return <div>{t("error")}</div>;
  }

  // data에서 estimateRequestId와 일치하는 항목 찾기
  const mydata = Array.isArray(data) ? data.find((item: any) => item.id === estimateId) : null;

  if (!mydata) {
    return <div>{t("estimateNotFound")}</div>;
  }

  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        {/* 견적 상세 정보 - 기사가 보낸 견적서 */}
        <RequestDetailMain data={mydata} />
      </div>
    </div>
  );
};
