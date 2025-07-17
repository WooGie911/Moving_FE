import Image from "next/image";
import React from "react";
import defaultProfileImg_sm from "@/assets/img/mascot/moverprofile-sm.png";
import { IDetailPageMainSeactionProps, QuoteInfo1, TMover } from "@/types/userQuote";

import { MoverInfo } from "./MoverInfo";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { DetailMoveInfo } from "./DetailMoveInfo";
import { ShareSection } from "./ShareSection";
import { LastButtonSection } from "./received/LastButtonSection";
import { LgButtonSection } from "./LgButtonSection";

export const DetailPageMainSeaction = ({ data }: { data: IDetailPageMainSeactionProps }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  const { moveType, isDesignated, estimateId, estimateState, estimateTitle, estimatePrice, mover, type } = data;
  const allowedTypes = ["small", "home", "office"] as const;
  const safeMovingType = allowedTypes.includes(QuoteInfo1.movingType as any)
    ? (QuoteInfo1.movingType as "small" | "home" | "office")
    : "small"; // 기본값

  return (
    <div
      className={`flex w-full flex-col items-center justify-center px-5 lg:flex-row lg:gap-[140px] ${type === "pending" ? "lg:items-center" : "lg:items-start"}`}
    >
      <div className="flex w-full max-w-[744px] flex-col gap-3 md:gap-5">
        {/* 프로필사진 영역 */}
        <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt="프로필이미지" fill />
          </div>
        </div>
        {/* 라벨 ~ 타이틀, 기사님정보 영역 */}
        <LabelAndTitleSection
          type={"received"}
          moveType={moveType}
          isDesignated={isDesignated}
          estimateState={estimateState}
          estimateTitle={estimateTitle}
          usedAtDetail={true}
        />
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 기사님 정보 */}
        <MoverInfo mover={mover} usedAtDetail={true} />
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 견적가 */}
        <div className="my-2 flex w-full flex-row items-center justify-between md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"> 견적가</p>
          <p className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold">{`${formatNumber(estimatePrice)}원`}</p>
        </div>
        <div className="border-border-light flex w-full flex-col border-b-1" />
        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo {...QuoteInfo1} movingType={safeMovingType} />

        <div className="border-border-light flex w-full flex-col border-b-1" />
        <div className="my-2 flex w-full flex-col items-start justify-center gap-10 lg:hidden">
          <ShareSection />
          {type === "pending" ? <LastButtonSection /> : ""}
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="my-2 flex w-full flex-col items-start justify-start gap-10 lg:w-[320px] lg:items-start">
          {type === "pending" ? <LgButtonSection estimatePrice={formatNumber(estimatePrice)} /> : ""}
          {type === "pending" ? <div className="border-border-light flex w-full flex-col border-b-1" /> : ""}
          <ShareSection />
        </div>
      </div>
    </div>
  );
};
