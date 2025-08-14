"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";

import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";
import { CardList } from "@/components/estimate/CardList";

export const MoverRequestPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("moverEstimate");
  const locale = useLocale();
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["MyRequestEstimates", locale],
    queryFn: () => moverEstimateApi.getMyEstimates(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending) {
    return (
      <main aria-label={t("ariaLabels.requestLoadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main aria-label={t("ariaLabels.requestErrorSection")}>
        <section aria-live="assertive">
          <Error error={error} reset={() => refetch()} />
        </section>
      </main>
    );
  }

  if (!data || data.length === 0) {
    return (
      <main aria-label={t("ariaLabels.requestMainContent")}>
        <nav aria-label={t("ariaLabels.requestTabNavigation")}>
          <EstimateRequestAndEstimateTab userType="Mover" />
        </nav>
        <section
          aria-label={t("ariaLabels.requestEmptyStateSection")}
          className="flex min-h-screen w-full flex-col items-center justify-center gap-7 bg-[#fafafa]"
        >
          <div className="flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-4">
            <h2 className="mb-2 text-lg font-medium text-gray-600" aria-label={t("ariaLabels.requestEmptyStateTitle")}>
              {t("noSentEstimates")}
            </h2>
            <p className="text-sm text-gray-500" aria-label={t("ariaLabels.requestEmptyStateDescription")}>
              {t("noSentEstimates")}
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main aria-label={t("ariaLabels.requestMainContent")}>
      <nav aria-label={t("ariaLabels.requestTabNavigation")}>
        <EstimateRequestAndEstimateTab userType="Mover" />
      </nav>
      <section
        aria-label={t("ariaLabels.requestListSection")}
        className="flex min-h-screen w-full flex-col items-center justify-start bg-[#fafafa]"
      >
        <div className="flex w-full flex-col items-center justify-center">
          <div
            className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6"
            aria-label={t("ariaLabels.requestListContainer")}
            role="list"
          >
            {data?.map((item, index: number) => (
              <article
                className="flex w-full flex-col items-center justify-center"
                key={item.id}
                role="listitem"
                aria-label={`${t("ariaLabels.requestCard")} ${index + 1}`}
              >
                <CardList
                  id={item.id}
                  data={item.estimateRequest!}
                  estimateStatus={item.status}
                  isDesignated={item.isDesignated}
                  estimatePrice={item.price!}
                  usedAt="sent"
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
