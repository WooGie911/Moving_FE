"use client";
import React, { useState } from "react";
import Image from "next/image";
import { TMoverInfo } from "@/types/customerEstimateRequest";
import { IMoverInfoProps } from "@/types/estimateRequest";
import chat from "@/assets/icon/etc/icon-chat.png";
import like_red from "@/assets/icon/like/icon-like-red.png";
import like_white from "@/assets/icon/like/icon-like-white-lg.png";
import like_black from "@/assets/icon/like/icon-like-black.png";
import star from "@/assets/icon/star/icon-star-active-sm.png";
import Favorite from "@/components/common/button/Favorite";
import { useTranslations } from "next-intl";

export const MoverInfo = ({ mover, usedAtDetail = false }: IMoverInfoProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const t = useTranslations("estimateRequest");
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    //todo 하트 버튼 클릭 시 찜하기 API 연동
  };

  return (
    <div className="border-border-light flex w-full flex-col items-start justify-center gap-1">
      {/* 기사님 별명과 찜 횟수 영역 */}
      <div className="flex w-full flex-row items-center justify-between">
        <div className="flex flex-row items-center justify-center gap-1">
          {mover.isVeteran || mover.workedCount! >= 10 ? <Image src={chat} alt="chat" width={20} height={20} /> : ""}
          <p
            className={`text-black-300 text-[14px] leading-[24px] font-semibold md:leading-[26px] md:font-medium ${usedAtDetail ? "text-[16px] md:text-[18px]" : "text-[14px] md:text-[16px]"} `}
          >{`${mover.nickname} ${t("driverSuffix")}`}</p>
        </div>

        {usedAtDetail ? (
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
          <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{mover.averageRating!.toFixed(1)}</p>
          <p className="text-[14px] leading-[24px] font-normal text-gray-500">{`(${mover.totalReviewCount})`}</p>
        </div>
        <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

        <div className="flex flex-row items-center justify-center gap-1">
          <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("experience")}</p>
          <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.career}${t("shared.units.years")}`}</p>
        </div>
        <div className="border-border-light mx-2 h-[14px] w-[1px] border-1"></div>

        <div className="flex flex-row items-center justify-center gap-1">
          <p className="text-black-300 text-[14px] leading-[24px] font-semibold">{`${mover.workedCount}${t("shared.units.cases")}`}</p>
          <p className="text-[14px] leading-[24px] font-normal text-gray-500">{t("confirmed")}</p>
        </div>
      </div>
    </div>
  );
};
