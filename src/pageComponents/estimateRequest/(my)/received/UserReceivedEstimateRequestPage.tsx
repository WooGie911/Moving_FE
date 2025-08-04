"use client";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { EstimateRequestAndEstimates } from "@/components/estimateRequest/(my)/received/EstimateRequestAndEstimates";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React from "react";
import notfound from "@/assets/img/mascot/notfound.png";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

const UserReceivedEstimateRequestPage = () => {
  const t = useTranslations("estimateRequest");
  const commonT = useTranslations("common");
  const locale = useLocale();
  const { data, isPending, isError } = useQuery({
    queryKey: ["receivedEstimateRequests", locale],
    queryFn: () => customerEstimateRequestApi.getReceivedEstimateRequests(locale),
  });

  if (isPending)
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  if (isError) {
    console.error("API 에러:", isError);
    return <div>{t("common.error")}</div>;
  }
  if (!data) return <div>{t("noDataAvailable")}</div>;

  // 완료된 견적 요청이 없는 경우
  if (data.length === 0) {
    return (
      <>
        <div className="flex flex-col items-center justify-center">
          <EstimateRequestAndEstimateTab userType="User" />
          <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
            <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
              <div className="relative h-[180px] w-[180px] md:h-[280px] md:w-[280px]">
                <Image src={notfound} alt="empty-estimateRequest" fill className="object-contain" />
              </div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">{t("noPastEstimates")}</div>
              <div className="text-[20px] leading-8 font-normal text-gray-400">{t("completeMoveToSeeHistory")}</div>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <EstimateRequestAndEstimateTab userType="User" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
        {data.map((item) => (
          <EstimateRequestAndEstimates key={item.estimateRequest.id} {...item} />
        ))}
      </div>
    </>
  );
};

export default UserReceivedEstimateRequestPage;
