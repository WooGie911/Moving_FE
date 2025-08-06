"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RejectDetailMain } from "@/components/estimate/(my)/rejected/[id]/RejectDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";

export const RejectedDetailPage = () => {
  const t = useTranslations("estimate");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { id } = useParams(); // 이렇게 해야 실제 URL 파라미터와 일치
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["MyRejectedEstimates", locale],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(locale),
  });

  if (isPending) {
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  }
  if (isError) return <Error error={error} reset={() => refetch()} />;

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
