"use client";
import { IQuoteResponse } from "@/types/moverEstimate";
import React from "react";
import { LabelArea } from "./LabelArea";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";
import { formatRelativeTime } from "@/utils/dateUtils";
import { shortenRegionInAddress } from "@/utils/regionMapping";
import arrow from "@/assets/icon/arrow/icon-arrow.png";
import { Button } from "../common/button/Button";
import edit from "@/assets/icon/edit/icon-edit.png";

interface ICardListProps {
  data: IQuoteResponse;
  isDesignated: boolean;
  isConfirmed: boolean;
  estimatePrice?: number;
  type: "received" | "sent" | "rejected";
}

export const CardList = ({ data, isDesignated, isConfirmed, type, estimatePrice }: ICardListProps) => {
  return (
    <div className="border-border-light flex w-full max-w-[327px] flex-col items-center justify-center gap-6 rounded-[20px] border-[0.5px] bg-[#ffffff] px-5 py-6 md:max-w-[600px] md:px-10 lg:max-w-[588px]">
      {/* 라벨과 확정견적/견적서시간/부분 */}
      <div className="flex w-full flex-row items-center justify-between">
        <LabelArea
          movingType={data.movingType.toLowerCase() as "small" | "home" | "office" | "document"}
          isDesignated={isDesignated}
        />
        {type === "received" ? (
          <p>{formatRelativeTime(data.createdAt)}</p>
        ) : isConfirmed ? (
          <div className="flex flex-row items-center justify-center gap-1">
            <Image src={confirm} alt="confirm" width={16} height={16} />
            <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
          </div>
        ) : (
          ""
        )}
      </div>
      {/* 고객 이름 부분  나중에 프로필같은거 추가할수도?*/}
      <div className="border-border-light flex w-full flex-row items-center justify-start border-b-[0.5px] pb-4">
        <p className="text-black-400 text-[16px] leading-[26px] font-semibold md:text-[20px] md:leading-[32px]">
          {`${data.user.name} 고객님`}
        </p>
      </div>
      {/* 이사 정보  부분*/}
      <div className="flex w-full flex-col gap-1 md:flex-row md:justify-between md:pt-2">
        <div className="flex flex-row gap-3">
          <div className="flex flex-col justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">출발지</p>
            <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
              {shortenRegionInAddress(data.departureAddr.split(" ").slice(0, 2).join(" "))}
            </p>
          </div>
          <div className="flex flex-col justify-end pb-1">
            <Image src={arrow} alt="arrow" width={16} height={16} />
          </div>
          <div className="flex flex-col justify-between">
            <p className="text-[14px] leading-6 font-normal text-gray-500">도착지</p>
            <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
              {shortenRegionInAddress(data.arrivalAddr.split(" ").slice(0, 2).join(" "))}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-between">
          <p className="text-[14px] leading-6 font-normal text-gray-500">이사일</p>
          <p className="text-black-500 text-[16px] leading-[26px] font-semibold">
            {`${data.movingDate.getFullYear()}년 ${data.movingDate.getMonth() + 1}월 ${data.movingDate.getDate()}일 (${["일", "월", "화", "수", "목", "금", "토"][data.movingDate.getDay()]})`}
          </p>
        </div>
      </div>
      {/* 버튼 혹은 견적금액 부분 */}

      {type === "received" ? (
        <div className="flex w-full flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:pt-4">
          <Button
            variant="outlined"
            state="default"
            width="w-[254px] lg:w-[233px]"
            height="h-[54px]"
            rounded="rounded-[12px]"
            onClick={() => console.log("반려모달 연결 예정")}
            className="hidden md:block"
          >
            반려하기
          </Button>
          <Button
            variant="solid"
            state="default"
            width="w-[254px] lg:w-[233px]"
            height="h-[54px]"
            rounded="rounded-[12px]"
            onClick={() => console.log("견적보내기 모달연결 예정")}
          >
            <div className="flex flex-row items-center justify-center gap-2">
              <p>견적 보내기 </p>
              <Image src={edit} alt="arrow" width={24} height={24} />
            </div>
          </Button>
          <Button
            variant="outlined"
            state="default"
            width="w-[254px] lg:w-[233px]"
            height="h-[54px]"
            rounded="rounded-[12px]"
            onClick={() => console.log("반려모달 연결 예정")}
            className="md:hidden"
          >
            반려하기
          </Button>
        </div>
      ) : type === "sent" ? (
        <div className="border-border-light mt-2 flex w-full flex-row items-center justify-between border-t-[0.5px] pt-4">
          <p className="text-black-400 text-[16px] leading-[26px] font-medium">견적금액</p>
          <p className="text-black-400 text-[24px] leading-[32px] font-bold">{estimatePrice?.toLocaleString()}원</p>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
