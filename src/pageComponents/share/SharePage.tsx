"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import shareApi, { IShareData } from "@/lib/api/share.api";
import { useLocale, useTranslations } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import Error from "@/app/error";
import { EstimateRequestAndEstimateTab } from "@/components/common/tab/EstimateRequestAndEstimateTab";
import { DetailPageImgSection } from "@/components/estimateRequest/(my)/DetailPageImgSection";
import Image from "next/image";

import confirm from "@/assets/icon/etc/icon-confirm.svg";
import { formatNumber } from "@/lib/utils/formatNumber";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";
import { getMovingTypeKey } from "@/lib/utils/getMovingTypeTranslated";
import { shortenRegionInAddress } from "@/utils/regionMapping";
export const SharePage = () => {
  const t = useTranslations("moverEstimate");

  const tt = useTranslations("customerEstimateRequest");
  const searchParams = useSearchParams();
  const locale = useLocale();
  const tShared = useTranslations();
  const estimateRequestId = searchParams.get("estimateRequestId");
  const estimateId = searchParams.get("estimateId");
  const weekdays = [
    tShared("shared.time.weekdays.sunday"),
    tShared("shared.time.weekdays.monday"),
    tShared("shared.time.weekdays.tuesday"),
    tShared("shared.time.weekdays.wednesday"),
    tShared("shared.time.weekdays.thursday"),
    tShared("shared.time.weekdays.friday"),
    tShared("shared.time.weekdays.saturday"),
  ];
  const timeFormat = {
    am: tShared("shared.time.timeFormat.am"),
    pm: tShared("shared.time.timeFormat.pm"),
  };

  const {
    data: shareData,
    isLoading,
    error,
  } = useQuery<IShareData>({
    queryKey: ["share", estimateRequestId, estimateId],
    queryFn: () => {
      return shareApi.getShareData(estimateRequestId!, estimateId || "");
    },
    enabled: !!estimateRequestId,
  });
  // movingType을 다국어로 변환하는 함수
  const getMovingTypeText = (type: string) => {
    const key = getMovingTypeKey(type.toLowerCase());
    return t(`movingTypes.${key}`);
  };

  if (isLoading) {
    return (
      <main aria-label={t("ariaLabels.requestDetailLoadingSection")}>
        <section aria-live="polite" aria-busy="true">
          <MovingTruckLoader size="lg" loadingText={t("loading")} />
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main aria-label={t("ariaLabels.requestDetailErrorSection")}>
        <section aria-live="assertive">
          <Error error={error} reset={() => {}} />
        </section>
      </main>
    );
  }

  if (!shareData) {
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

  const { estimateRequest, estimate } = shareData;

  // estimateRequest가 없으면 에러 처리
  if (!estimateRequest) {
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
        className="flex flex-col items-center justify-center gap-[46px] md:gap-[82px]"
      >
        <section aria-label={t("ariaLabels.requestDetailImageSection")}>
          <DetailPageImgSection />
        </section>
        <section
          aria-label={t("ariaLabels.requestDetailMainSection")}
          className="flex w-full max-w-[1200px] flex-col items-center justify-center gap-5 px-5 pb-30"
        >
          <main // Changed from div to main
            className={`flex w-full max-w-[1200px] flex-col items-center justify-center gap-5 px-5 pb-30`}
            aria-label={t("ariaLabels.requestDetailMain")}
            role="main"
          >
            {estimate ? (
              <section
                className="text-primary-400 border-border-light w-full border-b-1 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
                aria-label={t("ariaLabels.sharedMessageSection")}
                role="region"
              >
                <h1 // Added h1 for main heading
                  className="text-primary-400 pb-7 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
                >
                  {t("sharedEstimateMessage")}
                </h1>
              </section>
            ) : (
              <section
                className="text-primary-400 border-border-light w-full border-b-1 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
                aria-label={t("ariaLabels.rejectMessageSection")}
                role="region"
              >
                <h1 // Added h1 for main heading
                  className="text-primary-400 pb-7 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
                >
                  {t("rejectedEstimateMessage")}
                </h1>
              </section>
            )}

            {/* 유저 정보 */}
            <section // Changed from div to section
              className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pb-7"
              aria-label={t("ariaLabels.customerInfoSection")}
              role="region"
            >
              <h2 className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
                {`${estimateRequest.customer.name}${t("customerSuffix")}${t("customerEstimate")}`}
              </h2>
              <div className="hidden md:block">
                <div className="flex flex-row items-center justify-end gap-1">
                  {estimateRequest.status === "PROPOSED" ? (
                    <p
                      className="text-[16px] leading-[26px] font-semibold text-gray-300"
                      aria-label={t("ariaLabels.estimateWaiting")}
                    >
                      {t("estimateWaiting")}
                    </p>
                  ) : estimateRequest.status === "ACCEPTED" ? (
                    <div
                      className="flex flex-row items-center justify-center gap-1"
                      aria-label={t("ariaLabels.confirmedEstimate")}
                      role="group"
                    >
                      <Image
                        src={confirm}
                        alt=""
                        width={16}
                        height={16}
                        className="object-contain"
                        aria-hidden="true"
                      />
                      <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
                    </div>
                  ) : (
                    <p
                      className="text-[16px] leading-[26px] font-semibold text-gray-300"
                      aria-label={t("ariaLabels.rejectedEstimate")}
                    >
                      {t("rejectedEstimate")}
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* 견적가 */}
            <section // Changed from div to section
              className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pt-28 pb-7 md:justify-start md:gap-15"
              aria-label={t("ariaLabels.estimatePriceSection")}
              role="region"
            >
              <h3 className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
                {t("estimatePrice")}
              </h3>
              <p
                className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold"
                aria-label={`${t("ariaLabels.priceDisplay")}: ${formatNumber(estimate?.price || 0)}${tShared("shared.units.currency")}`}
              >
                {estimate
                  ? `${formatNumber(estimate?.price || 0)}${tShared("shared.units.currency")}`
                  : t("rejectedEstimateNoPrice")}
              </p>
            </section>

            {/* 이사견적 상세정보들 */}
            <section aria-label={t("ariaLabels.movingDetailSection")} role="region" className="w-full">
              <section
                className="my-2 flex w-full flex-col items-start justify-center gap-7"
                aria-labelledby="estimate-info-heading"
              >
                <h2
                  id="estimate-info-heading"
                  className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"
                >
                  {tt("estimateInfo")}
                </h2>
                <dl className="flex w-full flex-col items-start justify-center gap-3">
                  <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
                    <dt
                      className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
                      aria-label={tt("requestDateShort")}
                    >
                      {tt("requestDateShort")}
                    </dt>
                    <dd
                      className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
                      aria-label={`${tt("requestDateShort")}: ${formatDateDot(estimateRequest.createdAt)}`}
                    >
                      {formatDateDot(estimateRequest.createdAt)}
                    </dd>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
                    <dt
                      className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
                      aria-label={tt("service")}
                    >
                      {tt("service")}
                    </dt>
                    <dd
                      className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
                      aria-label={`${tt("service")}: ${getMovingTypeText(estimateRequest.moveType)}`}
                    >
                      {getMovingTypeText(estimateRequest.moveType)}
                    </dd>
                  </div>
                  <div className="flex w-full flex-row items-center justify-between md:justify-start md:gap-6">
                    <dt
                      className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
                      aria-label={tt("usageDate")}
                    >
                      {tt("usageDate")}
                    </dt>
                    <dd
                      className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
                      aria-label={`${tt("usageDate")}: ${formatDateWithDayAndTime(estimateRequest.moveDate, weekdays, timeFormat)}`}
                    >
                      {formatDateWithDayAndTime(estimateRequest.moveDate, weekdays, timeFormat)}
                    </dd>
                  </div>
                  <div className="flex w-full flex-row items-start justify-between md:justify-start md:gap-6">
                    <dt
                      className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
                      aria-label={t("departure")}
                    >
                      {t("departure")}
                    </dt>
                    <dd
                      className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
                      aria-label={`${t("departure")}: ${estimateRequest.fromAddress.region} ${estimateRequest.fromAddress.city} ${estimateRequest.fromAddress.district} ${estimateRequest.fromAddress.detail}`}
                    >
                      <span className="md:hidden">
                        <span className="block text-right">
                          {locale === "ko"
                            ? shortenRegionInAddress(estimateRequest.fromAddress.region)
                            : estimateRequest.fromAddress.region}{" "}
                          {estimateRequest.fromAddress.city}
                        </span>
                        <span className="block text-right">{estimateRequest.fromAddress.district}</span>
                        <span className="block text-right">{estimateRequest.fromAddress.detail}</span>
                      </span>
                      <span className="hidden md:inline">
                        {locale === "ko"
                          ? shortenRegionInAddress(estimateRequest.fromAddress.region)
                          : estimateRequest.fromAddress.region}{" "}
                        {estimateRequest.fromAddress.city} {estimateRequest.fromAddress.district}{" "}
                        {estimateRequest.fromAddress.detail}
                      </span>
                    </dd>
                  </div>
                  <div className="flex w-full flex-row items-start justify-between md:justify-start md:gap-6">
                    <dt
                      className="text- [16px] leading-[26px] font-normal text-gray-300 md:w-[90px] md:text-start"
                      aria-label={t("arrival")}
                    >
                      {t("arrival")}
                    </dt>
                    <dd
                      className="text-black-400 text-[16px] leading-[26px] font-medium md:font-semibold"
                      aria-label={`${t("arrival")}: ${estimateRequest.toAddress.region} ${estimateRequest.toAddress.city} ${estimateRequest.toAddress.district} ${estimateRequest.toAddress.detail}`}
                    >
                      <span className="md:hidden">
                        <span className="block text-right">
                          {locale === "ko"
                            ? shortenRegionInAddress(estimateRequest.toAddress.region)
                            : estimateRequest.toAddress.region}{" "}
                          {estimateRequest.toAddress.city}
                        </span>
                        <span className="block text-right">{estimateRequest.toAddress.district}</span>
                        <span className="block text-right">{estimateRequest.toAddress.detail}</span>
                      </span>
                      <span className="hidden md:inline">
                        {locale === "ko"
                          ? shortenRegionInAddress(estimateRequest.toAddress.region)
                          : estimateRequest.toAddress.region}{" "}
                        {estimateRequest.toAddress.city} {estimateRequest.toAddress.district}{" "}
                        {estimateRequest.toAddress.detail}
                      </span>
                    </dd>
                  </div>
                </dl>
              </section>

              <div className="border-border-light flex w-full flex-col border-b-1 pt-2" />
            </section>
          </main>
        </section>
      </section>
    </main>
  );

  //   <div className="mx-auto max-w-4xl p-6">
  //     <h1 className="mb-6 text-2xl font-bold">공유된 견적</h1>

  //     {estimateRequest && (
  //       <div className="mb-6 rounded-lg bg-white p-6 shadow-md">
  //         <h2 className="mb-4 text-xl font-semibold">견적 요청 정보</h2>

  //         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">이사 유형</h3>
  //             <p className="text-gray-900">{estimateRequest.moveType}</p>
  //           </div>

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">이사 날짜</h3>
  //             <p className="text-gray-900">{new Date(estimateRequest.moveDate).toLocaleDateString()}</p>
  //           </div>

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">출발지</h3>
  //             <p className="text-gray-900">
  //               {estimateRequest.fromAddress.region} {estimateRequest.fromAddress.city}{" "}
  //               {estimateRequest.fromAddress.district}
  //               {estimateRequest.fromAddress.detail && ` ${estimateRequest.fromAddress.detail}`}
  //             </p>
  //           </div>

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">도착지</h3>
  //             <p className="text-gray-900">
  //               {estimateRequest.toAddress.region} {estimateRequest.toAddress.city} {estimateRequest.toAddress.district}
  //               {estimateRequest.toAddress.detail && ` ${estimateRequest.toAddress.detail}`}
  //             </p>
  //           </div>

  //           {estimateRequest.description && (
  //             <div className="md:col-span-2">
  //               <h3 className="mb-2 font-medium text-gray-700">추가 요청사항</h3>
  //               <p className="text-gray-900">{estimateRequest.description}</p>
  //             </div>
  //           )}
  //         </div>
  //       </div>
  //     )}

  //     {estimate ? (
  //       <div className="rounded-lg bg-white p-6 shadow-md">
  //         <h2 className="mb-4 text-xl font-semibold">견적 정보</h2>

  //         <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">견적 금액</h3>
  //             <p className="text-2xl font-bold text-blue-600">{estimate.price!.toLocaleString()}원</p>
  //           </div>

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">견적 상태</h3>
  //             <p className="text-gray-900">{estimate.status}</p>
  //           </div>

  //           {estimate.comment && (
  //             <div className="md:col-span-2">
  //               <h3 className="mb-2 font-medium text-gray-700">견적 설명</h3>
  //               <p className="text-gray-900">{estimate.comment}</p>
  //             </div>
  //           )}

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">견적 생성일</h3>
  //             <p className="text-gray-900">{new Date(estimate.createdAt).toLocaleDateString()}</p>
  //           </div>

  //           <div>
  //             <h3 className="mb-2 font-medium text-gray-700">최종 수정일</h3>
  //             <p className="text-gray-900">{new Date(estimate.updatedAt).toLocaleDateString()}</p>
  //           </div>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="rounded-lg bg-white p-6 shadow-md">
  //         <h2 className="mb-4 text-xl font-semibold">견적 정보</h2>
  //         <p className="text-gray-500">아직 견적이 등록되지 않았습니다.</p>
  //       </div>
  //     )}
  //   </div>
};
