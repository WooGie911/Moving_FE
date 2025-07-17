import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../quote/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../quote/(my)/ShareSection";
import { IEstimateResponse } from "@/types/moverEstimate";
import { LabelArea } from "../../../LabelArea";
import confirm from "@/assets/icon/etc/icon-confirm.png";

export const RequestDetailMain = ({ data }: { data: IEstimateResponse }) => {
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };
  return (
    <div className={`flex w-full flex-col items-center justify-center px-5 pb-30 lg:flex-row lg:gap-[140px]`}>
      <div className="flex w-full max-w-[744px] flex-col items-start justify-center gap-5">
        {/* 프로필사진 영역 */}
        {/* <div className="relative w-full">
          <div className="absolute -top-[88px] left-[32px] z-10 h-[64px] w-[64px] -translate-x-1/2 rounded-[12px] bg-white shadow-lg md:-top-[155px] md:left-[50px] md:h-[100px] md:w-[100px] lg:-top-[175px] lg:left-[67px] lg:h-[134px] lg:w-[134px]">
            <Image src={defaultProfileImg_sm} alt="프로필이미지" fill />
          </div>
        </div> */}
        {/* 라벨 ~ 타이틀, 기사님정보 영역 */}
        <LabelArea
          movingType={data.quote?.movingType.toLowerCase() as "small" | "home" | "office" | "document"}
          isDesignated={true}
        />

        {/* 유저 정보 */}
        <div className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pb-7">
          <p className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
            {`${data.quote?.user?.name} 고객님`}
          </p>
          <div className={`flex flex-row items-center justify-end gap-1 ${data.status == "ACCEPTED" ? "" : "hidden"}`}>
            {/* 확정견적 라벨 */}
            <Image src={confirm} alt="confirm" width={16} height={16} />
            <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
          </div>
        </div>

        {/* 견적가 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"> 견적가</p>
          <p className="text-black-300 text-[20px] leading-[32px] font-bold md:text-[24px] md:font-bold">{`${formatNumber(data.price)}원`}</p>
        </div>

        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo
          movingType={data.quote?.movingType.toLowerCase() as "small" | "home" | "office"}
          requestDate={data.quote?.createdAt.toLocaleDateString() || "견적 요청일 정보 없음"}
          movingDate={data.quote?.movingDate.toLocaleDateString() || "이용일 정보 없음"}
          startPoint={data.quote?.departureAddr + " " + data.quote?.departureDetail || "출발지 정보 없음"}
          endPoint={data.quote?.arrivalAddr + " " + data.quote?.arrivalDetail || "도착지 정보 없음"}
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
