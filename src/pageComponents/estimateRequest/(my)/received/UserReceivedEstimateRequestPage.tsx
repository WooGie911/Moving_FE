"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import notfound from "@/assets/img/mascot/notfound.webp";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";
import dynamic from "next/dynamic";

// EstimateRequestAndEstimates 컴포넌트를 동적으로 로드
const EstimateRequestAndEstimates = dynamic(
  () =>
    import("@/components/estimateRequest/(my)/received/EstimateRequestAndEstimates").then((mod) => ({
      default: mod.EstimateRequestAndEstimates,
    })),
  {
    loading: () => (
      <div className="flex w-full items-center justify-center p-4">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
      </div>
    ),
    ssr: false, // 서버사이드 렌더링 비활성화로 클라이언트에서만 로드
  },
);

interface UserReceivedEstimateRequestPageProps {
  locale?: string;
  messages?: Record<string, any>;
}

const UserReceivedEstimateRequestPage = ({
  locale: propLocale,
  messages,
}: UserReceivedEstimateRequestPageProps = {}) => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("customerEstimateRequest");
  const locale = propLocale || useLocale();

  // 번역 데이터가 미리 로드된 경우 성능 최적화
  const isTranslationPreloaded = !!messages;
  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["receivedEstimateRequests", locale],
    queryFn: () => customerEstimateRequestApi.getReceivedEstimateRequests(locale),
    enabled: !!user && !isUserLoading,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  if (isPending)
    return (
      <main aria-label={t("aria.loadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );

  if (isError)
    return (
      <main aria-label={t("aria.errorSection")}>
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
          aria-label={t("aria.estimateRequestList")}
        >
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image
                src={notfound}
                alt={t("aria.emptyStateImage")}
                fill
                className="object-contain"
                priority
                sizes="(min-width: 768px) 280px, 180px"
                quality={85}
              />
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
        aria-label={t("aria.estimateRequestList")}
        role="list"
      >
        {data.map((item, index) => (
          <article
            className="flex w-full flex-col items-center justify-center"
            key={item.estimateRequest.id}
            role="listitem"
            aria-label={`${t("aria.estimateRequestItem")} ${index + 1}`}
          >
            <EstimateRequestAndEstimates {...item} />
          </article>
        ))}
      </section>
    </main>
  );
};

export default UserReceivedEstimateRequestPage;
