"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimateRequest/(my)/CardList";
import { RequestEstimateRequest } from "@/components/estimateRequest/(my)/pending/RequestEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import Image from "next/image";
import noEstimate from "@/assets/img/etc/noEstimate.webp";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { mapServiceTypeToMoveType } from "@/lib/utils/mapServiceTypeToMoveType";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { useAuth } from "@/providers/AuthProvider";

export const UserPendingEstimateRequestPage = () => {
  const { user, isLoading: isUserLoading } = useAuth();
  const t = useTranslations("customerEstimateRequest");
  const locale = useLocale();

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["pendingEstimateRequests", locale],
    queryFn: () => customerEstimateRequestApi.getPendingEstimateRequest(locale),
    enabled: !!user && !isUserLoading,
  });

  if (isPending)
    return (
      <main aria-label={t("aria.loadingSection")}>
        <MovingTruckLoader size="lg" loadingText={t("loading")} />
      </main>
    );
  if (isError)
    return (
      <main aria-label={t("aria.errorSection")}>
        <Error error={error} reset={() => refetch()} />
      </main>
    );

  if (!data || data.estimateRequest === null) {
    return (
      <main aria-label={t("aria.mainContent")}>
        <nav aria-label={t("aria.tabNavigation")}>
          <EstimateRequestAndEstimateTab userType="User" />
        </nav>
        <section
          aria-label={t("aria.emptyStateSection")}
          className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fafafa]"
        >
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={noEstimate} alt={t("aria.noEstimateImage")} fill className="object-contain" priority />
            </div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("noEstimateInProgress")}</div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("requestNewEstimate")}</div>
            <Link href="/estimateRequest/create">
              <Button
                variant="solid"
                state="default"
                width="w-[287px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                className="mt-4"
                aria-label={t("aria.createEstimateButton")}
              >
                {t("goToCreateEstimate")}
              </Button>
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const estimateRequest = data.estimateRequest;
  const estimates = data.estimates ?? [];

  // estimates 배열에서 ACCEPTED 상태인 견적이 있는지 확인
  const hasConfirmedEstimate = estimates.some((estimate) => estimate.status === "ACCEPTED");

  return (
    <main aria-label={t("aria.mainContent")}>
      <nav aria-label={t("aria.tabNavigation")}>
        <EstimateRequestAndEstimateTab userType="User" />
      </nav>
      {estimateRequest && (
        <section aria-label={t("aria.estimateRequestSection")}>
          <RequestEstimateRequest
            moveType={mapServiceTypeToMoveType(estimateRequest.moveType)}
            createdAt={estimateRequest.createdAt}
            moveDate={estimateRequest.moveDate}
            fromAddress={estimateRequest.fromAddress}
            toAddress={estimateRequest.toAddress}
          />
        </section>
      )}
      <section
        aria-label={t("aria.estimateListSection")}
        className="flex min-h-screen w-full flex-col items-center justify-center bg-[#fafafa]"
      >
        {estimates.length === 0 ? (
          <div className="flex min-h-screen flex-col items-center justify-center">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={noEstimate} alt={t("aria.noEstimateImage")} fill className="object-contain" priority />
            </div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("moversReviewing")}</div>
            <div className="text-[20px] leading-8 font-normal text-gray-400">{t("estimateComingSoon")}</div>
          </div>
        ) : (
          <div className="mb-[66px] flex h-full w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {estimates.map((item) => (
              <article key={item.id} aria-label={t("aria.estimateCard")}>
                <CardList
                  estimateRequest={estimateRequest}
                  estimate={item}
                  usedAt="pending"
                  hasConfirmedEstimate={hasConfirmedEstimate}
                />
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
export default UserPendingEstimateRequestPage;
