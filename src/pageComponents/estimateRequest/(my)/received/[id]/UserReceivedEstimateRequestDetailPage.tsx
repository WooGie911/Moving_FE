"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import { DetailPageMainSeaction } from "@/components/estimateRequest/(my)/DetailPageMainSeaction";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export const UserReceivedEstimateRequestDetailPage = () => {
  const { id: estimateId } = useParams(); // id는 estimateId
  const t = useTranslations("estimateRequest");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["estimateRequest", locale],
    queryFn: () => customerEstimateRequestApi.getReceivedEstimateRequests(locale),
  });

  if (isPending)
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  console.log("data", data);
  if (isError) {
    console.error("API 에러:", isError);
    return (
      <div>
        {t("common.error")} {t("pleaseRetry")}{" "}
      </div>
    );
  }
  if (!data) return <div>{t("noDataAvailable")}</div>;

  let foundEstimateRequest = null;
  let foundEstimate = null;

  for (const item of data) {
    const match = item.estimates.find((est) => est.id === estimateId);
    if (match) {
      foundEstimateRequest = item.estimateRequest;
      foundEstimate = match;
      break;
    }
  }

  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={foundEstimateRequest!} estimate={foundEstimate!} type="received" />
      </div>
    </>
  );
};
export default UserReceivedEstimateRequestDetailPage;
