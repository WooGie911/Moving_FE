"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { RequestDetailMain } from "@/components/estimate/(my)/request/[id]/RequestDetailMain";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { mockMyEstimateData } from "@/types/moverEstimate";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";

export const MoverRequestDetailPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("moverEstimate");
  const locale = useLocale();
  const { id: estimateId } = useParams();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["MyRequestEstimates", locale],
    queryFn: () => moverEstimateApi.getMyEstimates(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending) {
    return (
      <main aria-label={t("ariaLabels.requestDetailLoadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main aria-label={t("ariaLabels.requestDetailErrorSection")}>
        <section aria-live="assertive">
          <Error error={error} reset={() => refetch()} />
        </section>
      </main>
    );
  }

  // data에서 estimateRequestId와 일치하는 항목 찾기
  const mydata = Array.isArray(data) ? data.find((item: any) => item.id === estimateId) : null;

  if (!mydata) {
    return (
      <main aria-label={t("ariaLabels.requestDetailMainContent")}>
        <nav aria-label={t("ariaLabels.requestDetailTabNavigation")}>
          <EstimateRequestAndEstimateTab userType="Detail" />
        </nav>
        <section
          aria-label={t("ariaLabels.requestDetailNotFoundSection")}
          className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa]"
        >
          <div className="flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-4">
            <h2
              className="mb-2 text-lg font-medium text-gray-600"
              aria-label={t("ariaLabels.requestDetailNotFoundMessage")}
            >
              {t("estimateNotFound")}
            </h2>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main aria-label={t("ariaLabels.requestDetailMainContent")}>
      <nav aria-label={t("ariaLabels.requestDetailTabNavigation")}>
        <EstimateRequestAndEstimateTab userType="Detail" />
      </nav>
      <section
        aria-label={t("ariaLabels.requestDetailContentSection")}
        className="flex flex-col gap-[46px] md:gap-[82px]"
      >
        <section aria-label={t("ariaLabels.requestDetailImageSection")}>
          <DetailPageImgSection />
        </section>
        <section aria-label={t("ariaLabels.requestDetailMainSection")}>
          {/* 견적 상세 정보 - 기사가 보낸 견적서 */}
          <RequestDetailMain data={mydata} />
        </section>
      </section>
    </main>
  );
};
