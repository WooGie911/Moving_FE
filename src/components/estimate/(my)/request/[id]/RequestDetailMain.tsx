import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../estimateRequest/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../estimateRequest/(my)/ShareSection";
import { TMyEstimateResponse } from "@/types/moverEstimate";
import { LabelArea } from "../../../LabelArea";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import { formatDateDot, formatDateWithDayAndTime } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import { useTranslations } from "next-intl";

export const RequestDetailMain = ({ data }: { data: TMyEstimateResponse }) => {
  const t = useTranslations("estimate");
  const tShared = useTranslations();
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
        {/* 라벨 ~ 타이틀, 기사님정보 영역 */}
        <LabelArea
          movingType={data.estimateRequest.moveType.toLowerCase() as "small" | "home" | "office" | "document"}
          isDesignated={data.isDesignated}
          type="detail"
        />

        {/* 유저 정보 */}
        <div className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pb-7">
          <p className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
            {`${data.estimateRequest.customer.name}${t("customerSuffix")}`}
          </p>
          <div className={`flex flex-row items-center justify-end gap-1 ${data.status == "ACCEPTED" ? "" : "hidden"}`}>
            {/* 확정견적 라벨 */}
            <Image src={confirm} alt="confirm" width={16} height={16} />
            <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
          </div>
        </div>

        {/* 견적가 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            {t("estimatePrice")}
          </p>
          <p className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold">{`${formatNumber(data.price || 0)}${tShared("shared.units.currency")}`}</p>
        </div>

        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo
          id={data.estimateRequest.id}
          movingType={data.estimateRequest.moveType}
          createdAt={formatDateDot(data.estimateRequest.createdAt)}
          movingDate={data.estimateRequest.moveDate}
          departureAddr={
            shortenRegionInAddress(data.estimateRequest.fromAddress.region) +
            " " +
            data.estimateRequest.fromAddress.city +
            " " +
            data.estimateRequest.fromAddress.district +
            " " +
            data.estimateRequest.fromAddress.detail
          }
          arrivalAddr={
            shortenRegionInAddress(data.estimateRequest.toAddress.region) +
            " " +
            data.estimateRequest.toAddress.city +
            " " +
            data.estimateRequest.toAddress.district +
            " " +
            data.estimateRequest.toAddress.detail
          }
          departureDetail={""}
          arrivalDetail={""}
          status={data.estimateRequest.status}
          confirmedEstimateId={null}
          estimateCount={0}
          designatedEstimateCount={0}
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
