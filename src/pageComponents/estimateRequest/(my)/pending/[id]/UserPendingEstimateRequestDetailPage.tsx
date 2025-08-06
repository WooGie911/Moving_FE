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
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";

const UserPendingEstimateRequestDetailPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();

  const { id } = useParams();
  const t = useTranslations("estimateRequest");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["pendingEstimateRequests", locale],
    queryFn: () => customerEstimateRequestApi.getPendingEstimateRequest(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending)
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    ); // 또는 로딩 스피너 컴포넌트
  if (isError) return <Error error={error} reset={() => refetch()} />;

  const estimateRequest = data!.estimateRequest;
  const estimate = data!.estimates.find((estimate) => estimate.id === id);
  return (
    <>
      <EstimateRequestAndEstimateTab userType="Detail" />
      <div className="flex flex-col gap-[46px] md:gap-[82px]">
        <DetailPageImgSection />
        <DetailPageMainSeaction estimateRequest={estimateRequest} estimate={estimate!} type="pending" />
      </div>
    </>
  );
};

export default UserPendingEstimateRequestDetailPage;
