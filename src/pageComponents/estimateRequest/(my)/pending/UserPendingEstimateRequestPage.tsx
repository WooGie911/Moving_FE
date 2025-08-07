"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimateRequest/(my)/CardList";
import { RequestEstimateRequest } from "@/components/estimateRequest/(my)/pending/RequestEstimateRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
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
  // 마운트 시작 시간 (기준점) - useRef로 고정
  const mountStartTimeRef = useRef<number>(Date.now());
  const mountStartTime = mountStartTimeRef.current;

  setTimeout(() => {
    console.log("⏱️ UserPendingEstimateRequestPage 마운트 완료 시간:", Date.now() - mountStartTime, "ms");
  }, 0);

  const { user, isLoading: isUserLoading } = useAuth();
  const userLogtime = Date.now();
  console.log("전역유저데이터 로그타임", userLogtime - mountStartTime, "ms");
  console.log("전역유저데이터", user);
  const t = useTranslations("estimateRequest");
  const commonT = useTranslations("common");
  const locale = useLocale();

  // 쿼리 시작 시간을 컴포넌트 레벨에서 관리
  const queryStartTimeRef = useRef<number | null>(null);

  const { data, isPending, isError, error, refetch } = useQuery({
    queryKey: ["pendingEstimateRequests", locale],
    queryFn: () => {
      const queryStartTime = Date.now();
      queryStartTimeRef.current = queryStartTime;
      console.log("⏱️ 쿼리 시작 시간 (마운트 기준):", queryStartTime - mountStartTime, "ms");

      return customerEstimateRequestApi.getPendingEstimateRequest(locale).then((result) => {
        const queryEndTime = Date.now();
        console.log("⏱️ 쿼리 완료 시간 (마운트 기준):", queryEndTime - mountStartTime, "ms");
        console.log("⏱️ 쿼리 총 소요 시간:", queryEndTime - queryStartTime, "ms");
        return result;
      });
    },
    enabled: !!user && !isUserLoading,
  });

  if (isPending)
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );

  const dataLogtime = Date.now();
  console.log("실제 페이지 데이터 로그타임", dataLogtime - mountStartTime, "ms");
  console.log("실제 페이지 데이터", data);

  // 페이지 완전 렌더링 시간 측정 (조건부 렌더링에서 처리)
  if (data && !isPending && !isError) {
    const renderCompleteTime = Date.now();
    console.log("🎨 페이지 완전 렌더링 완료 시간:", renderCompleteTime - mountStartTimeRef.current, "ms");
    console.log("📊 총 페이지 로딩 시간:", renderCompleteTime - mountStartTimeRef.current, "ms");

    // 쿼리 시작 시간 기준으로 계산
    if (queryStartTimeRef.current) {
      const queryToRenderTime = renderCompleteTime - queryStartTimeRef.current;
      console.log("🔍 쿼리 시작부터 렌더링 완료까지:", queryToRenderTime, "ms");
    }

    // DOM 완전 로딩 시간 측정
    setTimeout(() => {
      const domCompleteTime = Date.now();
      console.log("🌐 DOM 완전 로딩 시간:", domCompleteTime - mountStartTimeRef.current, "ms");

      // 쿼리 시작 시간 기준으로 계산
      if (queryStartTimeRef.current) {
        const queryToDomCompleteTime = domCompleteTime - queryStartTimeRef.current;
        console.log("🔍 쿼리 시작부터 DOM 완료까지:", queryToDomCompleteTime, "ms");
      }

      // 라이트하우스 LCP 시간과 비교
      const totalLoadTime = domCompleteTime - mountStartTimeRef.current;
      console.log("⚡ 총 페이지 로딩 시간:", totalLoadTime, "ms");
      console.log("📈 라이트하우스 LCP 예상 시간:", totalLoadTime + "ms (실제 LCP와 비교 가능)");
    }, 0);
  }

  if (isError) return <Error error={error} reset={() => refetch()} />;

  if (!data || data.estimateRequest === null) {
    return (
      <div className="flex flex-col items-center justify-center">
        <EstimateRequestAndEstimateTab userType="User" />
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
              <Image src={noEstimate} alt="empty-estimateRequest" fill className="object-contain" priority />
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
              >
                {t("goToCreateEstimate")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const estimateRequest = data.estimateRequest;
  const estimates = data.estimates ?? [];

  // estimates 배열에서 ACCEPTED 상태인 견적이 있는지 확인
  const hasConfirmedEstimate = estimates.some((estimate) => estimate.status === "ACCEPTED");

  return (
    <>
      <div className="flex flex-col items-center justify-center">
        <EstimateRequestAndEstimateTab userType="User" />
        {estimateRequest && (
          <RequestEstimateRequest
            moveType={mapServiceTypeToMoveType(estimateRequest.moveType)}
            createdAt={estimateRequest.createdAt}
            moveDate={estimateRequest.moveDate}
            fromAddress={estimateRequest.fromAddress}
            toAddress={estimateRequest.toAddress}
          />
        )}
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          {estimates.length === 0 ? (
            <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
              <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
                <Image src={noEstimate} alt="empty-estimateRequest" fill className="object-contain" priority />
              </div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">{t("moversReviewing")}</div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">{t("estimateComingSoon")}</div>
            </div>
          ) : (
            <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 px-6 pt-[35px] md:mb-[98px] md:px-18 md:pt-[42px] lg:mx-auto lg:mb-[122px] lg:grid lg:max-w-[1200px] lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
              {estimates.map((item) => (
                <CardList
                  key={item.id}
                  estimateRequest={estimateRequest}
                  estimate={item}
                  usedAt="pending"
                  hasConfirmedEstimate={hasConfirmedEstimate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default UserPendingEstimateRequestPage;
