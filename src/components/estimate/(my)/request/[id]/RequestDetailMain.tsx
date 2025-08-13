import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../estimateRequest/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../estimateRequest/(my)/ShareSection";
import { TMyEstimateResponse } from "@/types/moverEstimate";
import { LabelArea } from "../../../LabelArea";
import confirm from "@/assets/icon/etc/icon-confirm.svg";
import { formatDateDot } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useTranslations, useLocale } from "next-intl";

export const RequestDetailMain = ({ data }: { data: TMyEstimateResponse }) => {
  const t = useTranslations("moverEstimate");
  const tShared = useTranslations();
  const locale = useLocale();
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  return (
    <main // Changed from div to main
      className={`flex w-full flex-col items-center justify-center px-5 pb-30 lg:flex-row lg:gap-[140px]`}
      aria-label={t("ariaLabels.requestDetailMain")}
      role="main"
    >
      <section
        className="flex w-full max-w-[744px] flex-col items-start justify-center gap-5"
        aria-label={t("ariaLabels.requestDetailMain")}
        role="region"
      >
        {/* 프로필사진 영역 */}
        {/* <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt={t("profileImage")} fill />
          </div>
        </div> */}
        {/* 라벨 ~ 타이틀, 기사님정보 영역 */}
        <LabelArea
          movingType={data.estimateRequest.moveType.toLowerCase() as "small" | "home" | "office" | "document"}
          isDesignated={data.isDesignated}
          usedAt="detail"
          estimateStatus={data.status}
        />

        {/* 유저 정보 */}
        <section // Changed from div to section
          className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pb-7"
          aria-label={t("ariaLabels.customerInfoSection")}
          role="region"
        >
          <h2 className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
            {`${data.estimateRequest.customer.name}${t("customerSuffix")}`}
          </h2>
          <div className="hidden md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              {data.status === "PROPOSED" ? (
                <p
                  className="text-[16px] leading-[26px] font-semibold text-gray-300"
                  aria-label={t("ariaLabels.estimateWaiting")}
                >
                  {t("estimateWaiting")}
                </p>
              ) : data.status === "ACCEPTED" ? (
                <div
                  className="flex flex-row items-center justify-center gap-1"
                  aria-label={t("ariaLabels.confirmedEstimate")}
                  role="group"
                >
                  <Image src={confirm} alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
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
          className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15"
          aria-label={t("ariaLabels.estimatePriceSection")}
          role="region"
        >
          <h3 className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            {t("estimatePrice")}
          </h3>
          <p
            className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold"
            aria-label={`${t("ariaLabels.priceDisplay")}: ${formatNumber(data.price || 0)}${tShared("shared.units.currency")}`}
          >
            {`${formatNumber(data.price || 0)}${tShared("shared.units.currency")}`}
          </p>
        </section>

        {/* 이사견적 상세정보들 */}
        <section aria-label={t("ariaLabels.movingDetailSection")} role="region" className="w-full">
          <DetailMoveInfo
            id={data.estimateRequest.id}
            movingType={data.estimateRequest.moveType}
            createdAt={formatDateDot(data.estimateRequest.createdAt)}
            movingDate={data.estimateRequest.moveDate}
            departureRegion={
              locale === "ko"
                ? shortenRegionInAddress(data.estimateRequest.toAddress.region)
                : data.estimateRequest.toAddress.region
            }
            departureCity={data.estimateRequest.fromAddress.city}
            departureDistrict={data.estimateRequest.fromAddress.district}
            departureDetail={data.estimateRequest.fromAddress.detail}
            arrivalRegion={
              locale === "ko"
                ? shortenRegionInAddress(data.estimateRequest.toAddress.region)
                : data.estimateRequest.toAddress.region
            }
            arrivalCity={data.estimateRequest.toAddress.city}
            arrivalDistrict={data.estimateRequest.toAddress.district}
            arrivalDetail={data.estimateRequest.toAddress.detail}
            status={data.estimateRequest.status}
            confirmedEstimateId={null}
            estimateCount={0}
            designatedEstimateCount={0}
          />
        </section>

        <div className="border-border-light flex w-full flex-col border-b-1 pt-2" />
        <section
          className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden"
          aria-label={t("ariaLabels.shareSection")}
          role="region"
        >
          <ShareSection
            estimate={{
              id: data.id,
              price: data.price || 0,
              mover: { ...data.mover, nickname: data.mover.nickname || "" },
            }}
            estimateRequest={data.estimateRequest}
          />
        </section>
      </section>
      <section className="hidden lg:block" aria-label={t("ariaLabels.shareSection")} role="region">
        <section className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start">
          <ShareSection
            estimate={{
              ...data,
              price: data.price || 0,
              mover: { ...data.mover, nickname: data.mover.nickname || "" },
            }}
            estimateRequest={data.estimateRequest}
          />
        </section>
      </section>
    </main>
  );
};
