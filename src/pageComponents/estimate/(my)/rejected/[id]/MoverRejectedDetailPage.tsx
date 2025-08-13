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
import { useAuth } from "@/providers/AuthProvider";

export const MoverRejectedDetailPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("moverEstimate");
  const locale = useLocale();
  const { id } = useParams(); // 이렇게 해야 실제 URL 파라미터와 일치
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["MyRejectedEstimates", locale],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending) {
    return (
      <main aria-label={t("ariaLabels.detailLoadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main aria-label={t("ariaLabels.detailErrorSection")}>
        <section aria-live="assertive">
          <Error error={error} reset={() => refetch()} />
        </section>
      </main>
    );
  }

  // data에서 estimateRequestId와 일치하는 항목 찾기
  const mydata = Array.isArray(data) ? data.find((item: any) => item.id === id) : null;

  if (!mydata) {
    return (
      <main aria-label={t("ariaLabels.detailMainContent")}>
        <nav aria-label={t("ariaLabels.detailTabNavigation")}>
          <EstimateRequestAndEstimateTab userType="Detail" />
        </nav>
        <section
          aria-label={t("ariaLabels.detailNotFoundSection")}
          className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa]"
        >
          <div className="flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-4">
            <h2 className="mb-2 text-lg font-medium text-gray-600" aria-label={t("ariaLabels.detailNotFoundMessage")}>
              {t("estimateNotFound")}
            </h2>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main aria-label={t("ariaLabels.detailMainContent")}>
      <nav aria-label={t("ariaLabels.detailTabNavigation")}>
        <EstimateRequestAndEstimateTab userType="Detail" />
      </nav>
      <section aria-label={t("ariaLabels.detailContentSection")} className="flex flex-col gap-[46px] md:gap-[82px]">
        <section aria-label={t("ariaLabels.detailImageSection")}>
          <DetailPageImgSection />
        </section>
        <section aria-label={t("ariaLabels.detailMainSection")}>
          <RejectDetailMain data={mydata.estimateRequest} />
        </section>
      </section>
    </main>
  );
};
