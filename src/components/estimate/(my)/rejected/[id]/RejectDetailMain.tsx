import Image from "next/image";
import React from "react";
import { DetailMoveInfo } from "../../../../quote/(my)/DetailMoveInfo";
import { ShareSection } from "../../../../quote/(my)/ShareSection";
import { IEstimateResponse, IQuoteResponse } from "@/types/moverEstimate";
import confirm from "@/assets/icon/etc/icon-confirm.png";

export const RejectDetailMain = ({ data }: { data: IQuoteResponse }) => {
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
        {/* 라벨 영역 */}
        <p className="text-primary-400 border-border-light w-full border-b-1 pb-7 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
          반려된 견적 입니다.
        </p>

        {/* 유저 정보 */}
        <div className="border-border-light flex w-full flex-row items-center justify-between border-b-[0.5px] pt-3 pb-7">
          <p className="text-black-400 text-[18px] leading-[26px] font-semibold md:text-[24px] md:leading-[32px]">
            {`${data.user.name} 고객님의 견적`}
          </p>
        </div>

        {/* 견적가 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-15">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold"> 견적가</p>
          <p className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold">{`견적이 반려되어 견적가가 존재하지 않습니다.`}</p>
        </div>

        {/* 견적가 */}
        <div className="border-border-light my-2 flex w-full flex-row items-center justify-between border-b-1 pb-7 md:justify-start md:gap-10">
          <p className="text-black-300 text-[16px] leading-[26px] font-semibold md:text-[20px] md:font-bold">
            반려 일자
          </p>
          <p className="text-primary-400 text-[12px] leading-[32px] font-bold md:text-[14px] md:font-bold">{`${data.updatedAt.toLocaleDateString()}`}</p>
        </div>

        {/* 이사견적 상세정보들 */}
        <DetailMoveInfo
          movingType={data.movingType.toLowerCase() as "small" | "home" | "office"}
          requestDate={data.createdAt.toLocaleDateString() || "견적 요청일 정보 없음"}
          movingDate={data.movingDate.toLocaleDateString() || "이용일 정보 없음"}
          startPoint={data.departureAddr + " " + data.departureDetail || "출발지 정보 없음"}
          endPoint={data.arrivalAddr + " " + data.arrivalDetail || "도착지 정보 없음"}
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
