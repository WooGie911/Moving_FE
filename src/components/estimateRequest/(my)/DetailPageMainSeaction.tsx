import Image from "next/image";
import React from "react";
import defaultProfileImg from "@/assets/img/mascot/moverprofile-xl.webp";
import info from "@/assets/icon/info/icon-info.svg";
import { IDetailPageMainSeactionProps, TEstimateResponse, TMoverInfo } from "@/types/customerEstimateRequest";
import { useTranslations, useLocale } from "next-intl";

import { MoverInfo } from "./MoverInfo";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { DetailMoveInfo } from "./DetailMoveInfo";
import { ShareSection } from "./ShareSection";
import { LastButtonSection } from "./received/LastButtonSection";
import { LgButtonSection } from "./LgButtonSection";
import { Button } from "@/components/common/button/Button";
import { shortenRegionInAddress } from "@/utils/regionMapping";

export const DetailPageMainSeaction = ({
  estimateRequest,
  estimate,
  type,
  estimates,
}: IDetailPageMainSeactionProps) => {
  const t = useTranslations("customerEstimateRequest");
  const tShared = useTranslations();
  const locale = useLocale();

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  return (
    <main
      className={`flex w-full flex-col items-center justify-center px-5 lg:flex-row lg:gap-[140px] ${type === "pending" ? "lg:items-center" : "lg:items-start"}`}
      aria-label={t("aria.estimateDetailSection")}
    >
      <section className="flex w-full max-w-[744px] flex-col gap-3 md:gap-5">
        {/* 프로필사진 영역 */}
        <div className="relative w-full">
          <div
            className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 overflow-hidden rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]"
            aria-label={t("aria.moverProfileImage")}
          >
            <Image
              src={estimate.mover?.moverImage || defaultProfileImg}
              alt={t("profileImage")}
              fill
              className="object-cover"
              priority
              sizes="(min-width: 1024px) 134px, (min-width: 768px) 100px, 64px"
              quality={85}
            />
          </div>
        </div>
        {/* 라벨과 타이틀 */}
        <LabelAndTitleSection
          estimate={estimate as TEstimateResponse}
          mover={estimate.mover! as TMoverInfo}
          usedAt={"detail"}
        />
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 기사님 정보 */}
        <section aria-label={t("aria.moverInfoSection")}>
          <MoverInfo mover={estimate.mover! as TMoverInfo} usedAt={"detail"} />
        </section>
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 견적가 */}
        <section
          className="my-2 flex w-full flex-row items-center justify-between md:justify-start md:gap-15"
          aria-label={t("aria.estimatePriceSection")}
        >
          <p
            className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"
            aria-label={t("aria.estimatePriceLabel")}
          >
            {t("estimatePrice")}
          </p>
          <p
            className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold"
            aria-label={t("aria.estimatePriceValue")}
          >
            {`${formatNumber(estimate.price)}${tShared("shared.units.currency")}`}
          </p>
        </section>
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 이사견적 상세정보들 */}
        <section aria-label={t("aria.movingDetailsSection")}>
          <DetailMoveInfo
            id={estimateRequest!.id}
            movingType={estimateRequest!.moveType as "SMALL" | "HOME" | "OFFICE"}
            movingDate={estimateRequest!.moveDate}
            createdAt={estimateRequest!.createdAt}
            departureRegion={
              locale === "ko"
                ? shortenRegionInAddress(estimateRequest!.fromAddress.region)
                : estimateRequest!.fromAddress.region
            }
            departureCity={estimateRequest!.fromAddress.city}
            departureDistrict={estimateRequest!.fromAddress.district}
            departureDetail={estimateRequest!.fromAddress.detail}
            arrivalRegion={
              locale === "ko"
                ? shortenRegionInAddress(estimateRequest!.toAddress.region)
                : estimateRequest!.toAddress.region
            }
            arrivalCity={estimateRequest!.toAddress.city}
            arrivalDistrict={estimateRequest!.toAddress.district}
            arrivalDetail={estimateRequest!.toAddress.detail}
            status={estimateRequest!.status}
            confirmedEstimateId={null}
            estimateCount={0}
            designatedEstimateCount={0}
          />
        </section>
        {estimate.status === "REJECTED" || estimate.status === "EXPIRED" || estimate.status === "CANCELLED" ? (
          <section
            className="my-2 flex w-full flex-col items-start justify-center gap-10"
            aria-label={t("aria.notConfirmedMessage")}
          >
            <Button
              variant="solid"
              width="w-full"
              height="h-[54px]"
              rounded="rounded-[8px]"
              disabled={true}
              state="disabled"
              aria-label={t("aria.disabledButton")}
            >
              <div className="flex flex-row items-center justify-center gap-3">
                <div className="relative h-[24px] w-[24px]">
                  <Image src={info} alt={t("aria.infoIcon")} fill className="object-contain" />
                </div>
                <p className="text-black-100 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
                  {t("notConfirmedEstimate")}
                </p>
              </div>
            </Button>
          </section>
        ) : (
          ""
        )}

        <div className="border-border-light flex w-full flex-col border-b-1" />
        <section
          className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden"
          aria-label={t("aria.actionButtonsSection")}
        >
          <ShareSection
            estimate={{
              id: estimate.id,
              price: estimate.price,
              mover: { ...estimate.mover, nickname: estimate.mover?.nickname || "" },
            }}
            estimateRequest={estimateRequest || undefined}
          />
          {type === "pending" ? (
            <LastButtonSection
              estimateId={estimate.id}
              estimateStatus={estimate.status}
              hasConfirmedEstimate={estimates?.some((e) => e.status === "ACCEPTED") || false}
              mover={estimate.mover}
            />
          ) : (
            ""
          )}
        </section>
      </section>
      <aside className="hidden lg:block">
        <section
          className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start"
          aria-label={t("aria.shareSection")}
        >
          {type === "pending" ? (
            <LgButtonSection
              estimateId={estimate.id}
              estimateStatus={estimate.status}
              hasConfirmedEstimate={estimates?.some((e) => e.status === "ACCEPTED") || false}
              estimatePrice={formatNumber(estimate.price)}
              mover={estimate.mover}
            />
          ) : (
            ""
          )}
          {type === "pending" ? <div className="border-border-light flex w-full flex-col border-b-1" /> : ""}
          <ShareSection
            estimate={{
              id: estimate.id,
              price: estimate.price,
              mover: { ...estimate.mover, nickname: estimate.mover?.nickname || "" },
            }}
            estimateRequest={estimateRequest || undefined}
          />
        </section>
      </aside>
    </main>
  );
};
