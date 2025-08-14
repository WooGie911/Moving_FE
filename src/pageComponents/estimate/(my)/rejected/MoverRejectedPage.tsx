"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimate/CardList";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";

export const MoverRejectedPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("moverEstimate");
  const locale = useLocale();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["MyRejectedEstimates", locale],
    queryFn: () => moverEstimateApi.getMyRejectedEstimateRequests(locale),
    enabled: !!user && !isUserLoading,
  });

  // 로딩 상태
  if (isPending) {
    return (
      <main aria-label={t("ariaLabels.loadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );
  }

  // 에러 상태
  if (isError) {
    return (
      <main aria-label={t("ariaLabels.errorSection")}>
        <section aria-live="assertive">
          <Error error={error} reset={() => refetch()} />
        </section>
      </main>
    );
  }

  // 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <main aria-label={t("ariaLabels.mainContent")}>
        <nav aria-label={t("ariaLabels.tabNavigation")}>
          <EstimateRequestAndEstimateTab userType="Mover" />
        </nav>
        <section
          aria-label={t("ariaLabels.emptyStateSection")}
          className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-[#fafafa]"
        >
          <div className="flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-4">
            <h2 className="mb-2 text-lg font-medium text-gray-600" aria-label={t("ariaLabels.emptyStateTitle")}>
              {t("noRejectedEstimates")}
            </h2>
            <p className="text-sm text-gray-500" aria-label={t("ariaLabels.emptyStateDescription")}>
              {t("noRejectedEstimates")}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main aria-label={t("ariaLabels.mainContent")}>
      <nav aria-label={t("ariaLabels.tabNavigation")}>
        <EstimateRequestAndEstimateTab userType="Mover" />
      </nav>
      <section
        aria-label={t("ariaLabels.estimateListSection")}
        className="flex min-h-screen w-full flex-col items-center justify-start bg-[#fafafa]"
      >
        <div className="flex w-full flex-col items-center justify-center">
          <div
            className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
            aria-label={t("ariaLabels.estimateListContainer")}
            role="list"
          >
            {data.map((item: any, index: number) => (
              <article
                className="flex w-full flex-col items-center justify-center"
                key={item.id}
                role="listitem"
                aria-label={`${t("ariaLabels.estimateCard")} ${index + 1}`}
              >
                <CardList
                  data={item.estimateRequest}
                  id={item.id}
                  isDesignated={item.isDesignated}
                  usedAt="rejected"
                  index={index}
                />
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
