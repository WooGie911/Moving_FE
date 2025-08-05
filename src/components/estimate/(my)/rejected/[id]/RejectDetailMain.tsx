import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../estimateRequest/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../estimateRequest/(my)/ShareSection";
import { TEstimateRequestResponse } from "@/types/moverEstimate";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import { formatDateDot } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useTranslations, useLocale } from "next-intl";

export const RejectDetailMain = ({ data }: { data: TEstimateRequestResponse }) => {
  const t = useTranslations("estimate");
  const locale = useLocale();
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  return (
    <div className={`flex w-full flex-col items-center justify-center px-5 pb-30 lg:flex-row lg:gap-[140px]`}>
      <div className="flex w-full max-w-[744px] flex-col items-start justify-center gap-5">
        {/* 프로필사진 영역 */}
        {/* <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt={t("profileImage")} fill />
          </div>
        </div> */}
        {/* 라벨 영역 */}
        <p className="text-primary-400 border-border-light w-full border-b-1 pb-7 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
          {t("rejectedEstimateMessage")}
        </p>

        {/* 유저 정보 */}
        <div className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pt-3 pb-7">
          <p className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
            {`${data.customer.name}${t("customerSuffix")}${t("customerEstimate")}`}
          </p>
        </div>

        {/* 견적가 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            {t("estimatePrice")}
          </p>
          <p className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold">
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
        </div>

        {/* 반려 일자 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-10">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            {t("rejectionDate")}
          </p>
          <p className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold">{`${formatDateDot(data.updatedAt)}`}</p>
        </div>

        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo
          id={data.id}
          movingType={data.moveType}
          createdAt={data.createdAt}
          movingDate={data.moveDate}
          departureRegion={locale === "ko" ? shortenRegionInAddress(data.fromAddress.region) : data.fromAddress.region}
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

        <div className="border-border-light flex w-full flex-col border-b-1 pt-2" />
        <div className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden">
          <ShareSection />
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start">
          <ShareSection />
        </div>
      </div>
    </div>
  );
};
