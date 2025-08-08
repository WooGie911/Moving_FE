import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../estimateRequest/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../estimateRequest/(my)/ShareSection";
import { TEstimateRequestResponse } from "@/types/moverEstimate";
import confirm from "@/assets/icon/etc/icon-confirm.svg";
import { formatDateDot } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useTranslations, useLocale } from "next-intl";

export const RejectDetailMain = ({ data }: { data: TEstimateRequestResponse }) => {
  const t = useTranslations("estimate");
  const ariaT = useTranslations("estimate.ariaLabels"); // Added
  const locale = useLocale();
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  return (
    <main // Changed from div to main
      className={`flex w-full flex-col items-center justify-center px-5 pb-30 lg:flex-row lg:gap-[140px]`}
      aria-label={ariaT("rejectDetailMain")} // Added
      role="main" // Added
    >
      <section // Changed from div to section
        className="flex w-full max-w-[744px] flex-col items-start justify-center gap-5"
        aria-label={ariaT("rejectDetailMain")} // Added
        role="region" // Added
      >
        {/* 프로필사진 영역 */}
        {/* <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt={t("profileImage")} fill />
          </div>
        </div> */}
        {/* 라벨 영역 */}
        <section // Changed from p to section
          className="text-primary-400 border-border-light w-full border-b-1 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
          aria-label={ariaT("rejectMessageSection")} // Added
          role="region" // Added
        >
          <h1 // Added h1 for main heading
            className="text-primary-400 pb-7 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
          >
            {t("rejectedEstimateMessage")}
          </h1>
        </section>

        {/* 유저 정보 */}
        <section // Changed from div to section
          className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pt-3 pb-7"
          aria-label={ariaT("customerInfoSection")} // Added
          role="region" // Added
        >
          <h2 // Changed from p to h2
            className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]"
          >
            {`${data.customer.name}${t("customerSuffix")}${t("customerEstimate")}`}
          </h2>
        </section>

        {/* 견적가 */}
        <section // Changed from div to section
          className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15"
          aria-label={ariaT("estimatePriceSection")} // Added
          role="region" // Added
        >
          <h3 // Changed from p to h3
            className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"
          >
            {t("estimatePrice")}
          </h3>
          <p // Changed from p to p (keeping as p since it's not a heading)
            className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold"
            aria-label={t("rejectedEstimateNoPrice")} // Added
          >
            {locale === "en" ? (
              <>
                <span
                  className="md:hidden"
                  dangerouslySetInnerHTML={{
                    __html: "Estimate price is not available<br />as the estimate was rejected.",
                  }}
                />
                <span className="hidden md:inline">Estimate price is not available as the estimate was rejected.</span>
              </>
            ) : (
              t("rejectedEstimateNoPrice")
            )}
          </p>
        </section>

        {/* 반려 일자 */}
        <section // Changed from div to section
          className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-10"
          aria-label={ariaT("rejectionDateSection")} // Added
          role="region" // Added
        >
          <h3 // Changed from p to h3
            className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"
          >
            {t("rejectionDate")}
          </h3>
          <p // Changed from p to p (keeping as p since it's not a heading)
            className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold"
            aria-label={`${t("rejectionDate")}: ${formatDateDot(data.updatedAt)}`} // Added
          >
            {`${formatDateDot(data.updatedAt)}`}
          </p>
        </section>

        {/* 이사견적 상세정보들 */}
        <section // Changed from div to section
          aria-label={ariaT("movingDetailSection")} // Added
          role="region" // Added
          className="w-full"
        >
          <DetailMoveInfo
            id={data.id}
            movingType={data.moveType}
            createdAt={data.createdAt}
            movingDate={data.moveDate}
            departureRegion={
              locale === "ko" ? shortenRegionInAddress(data.fromAddress.region) : data.fromAddress.region
            }
            departureCity={data.fromAddress.city}
            departureDistrict={data.fromAddress.district}
            departureDetail={data.fromAddress.detail}
            arrivalRegion={locale === "ko" ? shortenRegionInAddress(data.toAddress.region) : data.toAddress.region}
            arrivalCity={data.toAddress.city}
            arrivalDistrict={data.toAddress.district}
            arrivalDetail={data.toAddress.detail}
            status={data.status}
            confirmedEstimateId={null} // 또는 적절한 값
            estimateCount={0} // 또는 적절한 값
            designatedEstimateCount={0} // 또는 적절한 값
          />
        </section>

        <div className="border-border-light flex w-full flex-col border-b-1 pt-2" />
        <section // Changed from div to section
          className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden"
          aria-label={ariaT("shareSection")} // Added
          role="region" // Added
        >
          <ShareSection estimateRequest={data} />
        </section>
      </section>
      <section // Changed from div to section
        className="hidden lg:block"
        aria-label={ariaT("shareSection")} // Added
        role="region" // Added
      >
        <section // Changed from div to section
          className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start"
        >
          <ShareSection estimateRequest={data} />
        </section>
      </section>
    </main>
  );
};
