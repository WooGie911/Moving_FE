"use client";

import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React, { useState } from "react";
import defaultProfile from "@/assets/img/mascot/moverprofile-sm.png";
import chat from "@/assets/icon/etc/icon-chat.png";
import like_red from "@/assets/icon/like/icon-like-red.png";
import like_white from "@/assets/icon/like/icon-like-white-lg.png";
import star from "@/assets/icon/star/icon-star-active-sm.png";
import { Button } from "@/components/common/button/Button";
import Link from "next/link";

// 숫자를 천 단위로 쉼표를 추가하는 함수
const formatNumber = (num: number): string => {
  return num.toLocaleString();
};

type TProfile = {
  id: number;
  userId: number;
  nickname: string;
  profileImage?: string | undefined | "";
  experience?: number; // 경력
  introduction: string;
  completedCount: number; // 완료된 이사 건수
  avgRating: number; // 평균 평점
  reviewCount: number; // 리뷰 총 개수
  favoriteCount: number; // 찜한 사용자 수
  description: string;
};

type TMover = {
  id: number;
  email: string;
  name: String;
  currentRole: "CUSTOMER" | "MOVER";
  profile: TProfile;
};

interface ICardListProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  estimateId: string;
  estimateState: string;
  estimateTitle: string;
  estimatePrice: number;
  mover: TMover;
  type: "pending" | "received";
}
//todo Link컴포넌트 연결->상세페이지 이동
export const CardList = ({
  movingType,
  isDesignated,
  estimateId,
  estimateState,
  estimateTitle,
  estimatePrice,
  mover,
  type,
}: ICardListProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    console.log(isLiked);
    //todo 하트 버튼 클릭 시 찜하기 API 연동
  };

  return (
    <div className="border-border-light flex max-w-[327px] flex-col items-center justify-center gap-4 rounded-[20px] border-[0.5px] bg-[#ffffff] px-5 py-6 md:max-w-[600px] lg:max-w-[558px]">
      {/* 라벨 및 견적서 상태 영역 */}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row gap-2">
          <MoveTypeLabel type={movingType} />
          {isDesignated && <MoveTypeLabel type="document" />}
        </div>
        <div>
          <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{estimateState}</p>
        </div>
      </div>
      {/* 견적서 타이틀 영역 */}
      <h1 className="text-black-300 w-full text-[16px] leading-[26px] font-semibold">{estimateTitle}</h1>
      {/* 기사님 프로필 영역 */}
      <div className="flex w-full">
        <div className="border-border-light flex w-full flex-row items-center justify-center gap-2 border-b-1 pt-3 pb-5">
          {/* 좌측 프로필 이미지 */}
          <Image
            src={mover.profile.profileImage ? mover.profile.profileImage : defaultProfile}
            alt="profile"
            width={50}
            height={50}
          />
          {/* 프로필 이미지 외 모든 프로필 정보*/}
          <div className="border-border-light flex w-full flex-col items-start justify-center gap-1 pt-4 pb-5">
            {/* 기사님 별명과 찜 횟수 영역 */}
            <div className="flex w-full flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={chat} alt="chat" width={20} height={20} />
                <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.profile.nickname} 기사님`}</p>
              </div>

              <div className="flex flex-row items-center justify-center gap-1">
                <button className="flex cursor-pointer flex-row items-center justify-center" onClick={handleLikeClick}>
                  <Image src={isLiked ? like_red : like_white} alt="like" width={20} height={20} />
                </button>
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{mover.profile.favoriteCount}</p>
              </div>
            </div>
            {/* 기사님 평점과 경력 확정건수 영역 */}
            <div className="flex w-full flex-row items-center justify-start">
              <div className="flex flex-row items-center justify-center gap-1">
                <Image src={star} alt="star" width={20} height={20} />
                <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{mover.profile.avgRating}</p>
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{`(${mover.profile.reviewCount})`}</p>
              </div>
              <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{"경력"}</p>
                <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.profile.experience}년`}</p>
              </div>
              <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

              <div className="flex flex-row items-center justify-center gap-1">
                <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.profile.completedCount}건`}</p>
                <p className="text-[14px] leading-[24px] font-normal text-gray-500">{"확정"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 견적서 금액 영역 */}
      <div className="flex w-full flex-row items-center justify-between">
        <p className="text-[14px] leading-[24px] font-normal text-gray-300">{"견적 금액"}</p>
        <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${formatNumber(estimatePrice)}원`}</p>
      </div>
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
            <Link href={type === "pending" ? `/quote/pending/${estimateId}` : `/quote/received/${estimateId}`}>
              <Button variant="outlined" state="default" width="w-[287px]" height="h-[54px]" rounded="rounded-[12px]">
                상세보기
              </Button>
            </Link>
          </div>

          <div className="hidden w-full md:block">
            <div className="flex w-full flex-row items-center justify-between gap-[11px]">
              <Link href={type === "pending" ? `/quote/pending/${estimateId}` : `/quote/received/${estimateId}`}>
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
};
