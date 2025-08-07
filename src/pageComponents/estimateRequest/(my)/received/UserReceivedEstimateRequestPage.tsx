"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { EstimateRequestAndEstimates } from "@/components/estimateRequest/(my)/received/EstimateRequestAndEstimates";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import notfound from "@/assets/img/mascot/notfound.webp";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";

const UserReceivedEstimateRequestPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
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
      <main aria-label={t("ariaLabels.loadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
        </section>
      </main>
    );

  if (isError)
    return (
      <main aria-label={t("ariaLabels.errorSection")}>
        <Error error={error} reset={() => refetch()} />
      </main>
    );

  if (!data)
    return (
      <main>
        <section aria-live="polite">
          <p>{t("noDataAvailable")}</p>
        </section>
      </main>
    );

  // 완료된 견적 요청이 없는 경우
  if (data.length === 0) {
    return (
      <main>
        <EstimateRequestAndEstimateTab userType="User" />
        <section
          className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]"
          aria-label={t("ariaLabels.estimateRequestList")}
        >
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={notfound} alt={t("ariaLabels.emptyStateImage")} fill className="object-contain" />
            </div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("noPastEstimates")}</div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("completeMoveToSeeHistory")}</div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main>
      <EstimateRequestAndEstimateTab userType="User" />
      <section
        className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9"
        aria-label={t("ariaLabels.estimateRequestList")}
        role="list"
      >
        {data.map((item, index) => (
          <article
            key={item.estimateRequest.id}
            role="listitem"
            aria-label={`${t("ariaLabels.estimateRequestItem")} ${index + 1}`}
          >
            <EstimateRequestAndEstimates {...item} />
          </article>
        ))}
      </section>
    </main>
  );
};

export default UserReceivedEstimateRequestPage;
