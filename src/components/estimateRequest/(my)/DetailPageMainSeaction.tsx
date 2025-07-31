import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/common/button/Button";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { MoverInfo } from "./MoverInfo";
import { DetailMoveInfo } from "./DetailMoveInfo";
import { ShareSection } from "./ShareSection";
import { LgButtonSection } from "./LgButtonSection";
import { LastButtonSection } from "./LastButtonSection";
import { createComplexAddressDisplay } from "@/utils/estimateRequestUtils";
import type { IDetailPageMainSeactionProps, TMoverInfo } from "@/types/estimateRequest";
import defaultProfileImg_sm from "@/assets/img/etc/default-profile-sm.png";
import info from "@/assets/icon/info/info.png";

export const DetailPageMainSeaction = ({ estimateRequest, estimate, type }: IDetailPageMainSeactionProps) => {
  const t = useTranslations("estimateRequest");

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  // 이사 종류에 따른 타입 설정
  const moveType = estimateRequest.moveType ? estimateRequest.moveType.toLowerCase() : "small"; // 기본값

  // 주소 생성
  const departureAddr = createComplexAddressDisplay(
    estimateRequest.fromAddress.region,
    estimateRequest.fromAddress.city,
    estimateRequest.fromAddress.district,
    estimateRequest.fromAddress.detail,
  );

  const arrivalAddr = createComplexAddressDisplay(
    estimateRequest.toAddress.region,
    estimateRequest.toAddress.city,
    estimateRequest.toAddress.district,
    estimateRequest.toAddress.detail,
  );

  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-5 lg:flex-row lg:gap-[140px] ${type === "pending" ? "lg:items-center" : "lg:items-start"}`}
    >
      <div className="flex w-full max-w-[744px] flex-col gap-3 md:gap-5">
        {/* 프로필사진 영역 */}
        <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt={t("profileImage")} fill />
          </div>
        </div>
        {/* 라벨 ~ 타이틀, 기사님정보 영역 */}
        <LabelAndTitleSection
          type={"received"}
          mover={estimate.mover as TMoverInfo}
          isDesignated={estimate.isDesignated}
          estimateState={estimate.status as "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED"}
          estimateTitle={estimate.comment || ""}
          usedAtDetail={true}
        />
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 기사님 정보 */}
        <MoverInfo mover={estimate.mover as TMoverInfo} usedAtDetail={true} />
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 견적가 */}
        <div className="my-2 flex w-full flex-row items-center justify-between md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            {t("estimatePrice")}
          </p>
          <p className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold">{`${formatNumber(estimate.price)}${t("currency")}`}</p>
        </div>
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo
          id={estimateRequest.id}
          movingType={estimateRequest.moveType as "SMALL" | "HOME" | "OFFICE"}
          movingDate={estimateRequest.moveDate}
          createdAt={estimateRequest.createdAt}
          departureAddr={departureAddr}
          arrivalAddr={arrivalAddr}
          departureDetail={estimateRequest.fromAddress.detail}
          arrivalDetail={estimateRequest.toAddress.detail}
          status={estimateRequest.status}
          confirmedEstimateId={null}
          estimateCount={0}
          designatedEstimateCount={0}
        />
        {estimate.status === "REJECTED" || estimate.status === "EXPIRED" ? (
          <div className="my-2 flex w-full flex-col items-start justify-center gap-10">
            <Button
              variant="solid"
              width="w-full"
              height="h-[54px]"
              rounded="rounded-[8px]"
              disabled={true}
              state="disabled"
            >
              <div className="flex flex-row items-center justify-center gap-3">
                <Image src={info} alt="like" width={24} height={24} />
                <p className="text-black-100 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
                  {t("notConfirmedEstimate")}
                </p>
              </div>
            </Button>
          </div>
        ) : (
          ""
        )}

        <div className="border-border-light flex w-full flex-col border-b-1" />
        <div className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden">
          <ShareSection />
          {type === "pending" ? <LastButtonSection /> : ""}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start">
          {type === "pending" ? <LgButtonSection estimatePrice={formatNumber(estimate.price)} /> : ""}
          {type === "pending" ? <div className="border-border-light flex w-full flex-col border-b-1" /> : ""}
          <ShareSection />
        </div>
      </div>
    </div>
  );
};
