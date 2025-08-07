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

export const UserReceivedEstimateRequestDetailPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const { id: estimateId } = useParams(); // id는 estimateId
  const t = useTranslations("estimateRequest");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["receivedEstimateRequests", locale],
    queryFn: () => customerEstimateRequestApi.getReceivedEstimateRequests(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending)
    return (
      <main aria-label={t("aria.detailPageLoadingSection")}>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </main>
    );
  if (isError) return <Error error={error} reset={() => refetch()} />;
  if (!data) return <main aria-label={t("aria.detailPageNoDataSection")}>{t("noDataAvailable")}</main>;

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
    <main aria-label={t("aria.detailPageContent")}>
      <nav aria-label={t("aria.detailPageTabSection")}>
        <EstimateRequestAndEstimateTab userType="Detail" />
      </nav>
      <section className="flex flex-col gap-[46px] md:gap-[82px]" aria-label={t("aria.detailPageMainSection")}>
        <section aria-label={t("aria.detailPageImageSection")}>
          <DetailPageImgSection />
        </section>
        <DetailPageMainSeaction estimateRequest={foundEstimateRequest!} estimate={foundEstimate!} type="received" />
      </section>
    </main>
  );
};
export default UserReceivedEstimateRequestDetailPage;
