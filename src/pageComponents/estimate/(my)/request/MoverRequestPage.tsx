"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { CardList } from "@/components/estimate/CardList";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export const MoverRequestPage = () => {
  const t = useTranslations("estimate");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["MyRequestEstimates", locale],
    queryFn: () => moverEstimateApi.getMyEstimates(locale),
  });
  // 로딩 상태
  if (isPending) {
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    console.error(`${t("apiError")}`, error);
    return <div>{commonT("error")}</div>;
  }

  console.log("테이스용", data);
  // 데이터가 없는 경우
  if (!data || data.length === 0) {
    return (
      <div>
        <EstimateRequestAndEstimateTab userType="Mover" />
        <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa]">
          <div className="flex min-h-screen w-full max-w-[1200px] flex-col items-center justify-center gap-4">
            <p className="mb-2 text-lg font-medium text-gray-600">{t("noSentEstimates")}</p>
            <p className="text-sm text-gray-500">{t("noSentEstimates")}</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div>
      <EstimateRequestAndEstimateTab userType="Mover" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {data?.map((item, index: number) => (
              <CardList
                key={item.id}
                id={item.id}
                data={item.estimateRequest!}
                estimateStatus={item.status}
                isDesignated={item.isDesignated}
                estimatePrice={item.price!}
                usedAt="sent"
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
