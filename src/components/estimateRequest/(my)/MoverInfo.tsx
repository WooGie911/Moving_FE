"use client";
import React, { useState } from "react";
import Image from "next/image";
import defaultProfile from "@/assets/img/mascot/moverprofile-sm.png";
import { IMoverInfoProps } from "@/types/customerEstimateRequest";
import veteran from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-sm.png";
import Favorite from "@/components/common/button/Favorite";
import { useTranslations } from "next-intl";

export const MoverInfo = ({ mover, usedAt }: IMoverInfoProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const t = useTranslations("estimateRequest");
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    //todo 하트 버튼 클릭 시 찜하기 API 연동
  };

  return (
    <div className={`flex w-full ${usedAt === "received" ? "border-border-light rounded-lg border-2 p-2" : ""}`}>
      <div
        className={`flex w-full flex-row items-center justify-center gap-2 py-3 ${usedAt === "pending" ? "border-border-light border-b-1" : ""} `}
      >
        {/* 좌측 프로필 이미지 */}
        <Image src={mover.moverImage ? mover.moverImage : defaultProfile} alt="profile" width={50} height={50} />
        {/* 프로필 이미지 외 모든 프로필 정보*/}

        <div className="border-border-light flex w-full flex-col items-start justify-center gap-1">
          {/* 기사님 별명과 찜 횟수 영역 */}
          <div className="flex w-full flex-row items-center justify-between">
            <div className="flex flex-row items-center justify-center gap-1">
              {mover.isVeteran || mover.workedCount! >= 10 ? (
                <Image src={veteran} alt="chat" width={20} height={20} />
              ) : (
                ""
              )}
              <p
                className={`text-black-300 text-[14px] leading-[24px] font-semibold md:leading-[26px] md:font-medium ${usedAt === "detail" ? "text-[16px] md:text-[18px]" : "text-[14px] md:text-[16px]"} `}
              >{`${mover.nickname} ${t("driverSuffix")}`}</p>
            </div>

            {usedAt === "detail" ? (
              <div className="flex flex-row items-center justify-center gap-1">
                <Favorite
                  isFavorited={mover.isFavorite}
                  heartPosition="right"
                  favoriteCount={mover.totalFavoriteCount}
                  moverId={mover.id}
                />
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center gap-1">
                <Favorite isFavorited={mover.isFavorite} favoriteCount={mover.totalFavoriteCount} moverId={mover.id} />
              </div>
            )}
          </div>
          {/* 기사님 평점과 경력 확정건수 영역 */}
          <div className="flex w-full flex-row items-center justify-start">
            <div className="flex flex-row items-center justify-center gap-1">
              <Image src={star} alt="star" width={20} height={20} />
              <p className="text-black-300 text-[14px] leading-[24px] font-semibold">
                {mover.averageRating!.toFixed(1)}
              </p>
              <p className="text-[14px] leading-[24px] font-normal text-gray-500">{`(${mover.totalReviewCount})`}</p>
            </div>
            <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

            <div className="flex flex-row items-center justify-center gap-1">
              <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("experience")}</p>
              <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.career}${t("years")}`}</p>
            </div>
            <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

            <div className="flex flex-row items-center justify-center gap-1">
              <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.workedCount}${t("cases")}`}</p>
              <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("confirmed")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
