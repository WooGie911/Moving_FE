"use client";

import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React, { useState } from "react";
import defaultProfile from "@/assets/img/mascot/moverprofile-sm.png";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";
import { ICardListProps } from "@/types/customerEstimateRequest";
import { LabelAndTitleSection } from "./LabelAndTitleSection";
import { MoverInfo } from "./MoverInfo";

// 숫자를 천 단위로 쉼표를 추가하는 함수
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

export const CardList = ({
  isDesignated,
  estimateId,
  estimateState,
  estimateTitle,
  estimatePrice,
  mover,
  type,
}: ICardListProps) => {
  const cardContent = (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 rounded-[20px] bg-[#ffffff] py-6 ${type === "received" ? "" : "border-border-light max-w-[327px] border-[0.5px] px-5 md:max-w-[600px] lg:max-w-[558px]"}`}
    >
      <div className="flex w-full flex-col items-center justify-center gap-1">
        <LabelAndTitleSection
          estimateState={estimateState}
          estimateTitle={estimateTitle}
          isDesignated={isDesignated}
          mover={mover}
          type={type}
          usedAtDetail={false}
        />
        {/* 기사님 프로필 영역 */}
        <div className={`flex w-full ${type === "received" ? "border-border-light rounded-lg border-2 p-2" : ""}`}>
          <div
            className={`flex w-full flex-row items-center justify-center gap-2 py-3 ${type === "pending" ? "border-border-light border-b-1" : ""} `}
          >
            {/* 좌측 프로필 이미지 */}
            <Image src={mover.moverImage ? mover.moverImage : defaultProfile} alt="profile" width={50} height={50} />
            {/* 프로필 이미지 외 모든 프로필 정보*/}
            <MoverInfo mover={mover} usedAtDetail={false} />
          </div>
        </div>
      </div>
      {/* 견적서 금액 영역 */}

      {type === "pending" ? (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <p className="text-[14px] leading-[24px] font-normal text-gray-300 md:text-[16px] md:leading-[26px] md:font-medium">
            견적 금액
          </p>
          <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimatePrice)}원`}</p>
        </div>
      ) : (
        <div className="flex w-full flex-row items-center justify-between pb-2 md:pt-1 md:pb-5 lg:pt-3">
          <div className="flex w-full flex-row items-center justify-start gap-1 md:hidden">
            {estimateState === "PROPOSED" ? (
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">견적대기</p>
            ) : estimateState === "ACCEPTED" ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={confirm} alt="confirm" width={16} height={16} />
                <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
              </div>
            ) : (
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">반려견적</p>
            )}
          </div>
          <div className="flex w-full flex-row items-center justify-end gap-3 md:justify-end">
            <p className="text-[14px] leading-[24px] font-normal text-gray-500 md:text-[16px] md:leading-[26px] md:font-medium">
              견적 금액
            </p>
            <p className="text-black-300 text-[20px] leading-[32px] font-semibold md:text-[24px] md:font-bold">{`${formatNumber(estimatePrice)}원`}</p>
          </div>
        </div>
      )}
      {type === "pending" ? (
        <div className="flex w-full flex-col items-center justify-center">
          <div className="flex w-full flex-col items-center justify-center gap-[11px] px-5 md:hidden">
            <Button
              variant="solid"
              state="default"
              width="w-[287px]"
              height="h-[54px]"
              rounded="rounded-[12px]"
              onClick={() => console.log("견적 확정 모달 연결 예정")}
            >
              견적 확정하기
            </Button>
            <Link href={`/estimateRequest/pending/${estimateId}`}>
              <Button variant="outlined" state="default" width="w-[287px]" height="h-[54px]" rounded="rounded-[12px]">
                상세보기
              </Button>
            </Link>
          </div>

          <div className="hidden w-full md:block">
            <div className="flex w-full flex-row items-center justify-between gap-[11px]">
              <Link href={`/estimateRequest/pending/${estimateId}`}>
                <Button
                  variant="outlined"
                  state="default"
                  width="w-[254px] lg:w-[233px]"
                  height="h-[54px]"
                  rounded="rounded-[12px]"
                >
                  상세보기
                </Button>
              </Link>
              <Button
                variant="solid"
                state="default"
                width="w-[254px] lg:w-[233px]"
                height="h-[54px]"
                rounded="rounded-[12px]"
                onClick={() => console.log("모달연결 예정")}
              >
                견적 확정하기
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );

  return type === "received" ? (
    <Link href={`/estimateRequest/received/${estimateId}`}>{cardContent}</Link>
  ) : (
    cardContent
  );
};
