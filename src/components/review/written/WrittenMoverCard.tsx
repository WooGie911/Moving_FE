"use client";

import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import StarFill from "@/assets/icon/star/icon-star-active-lg.webp";
import Star from "@/assets/icon/star/icon-star-inactive-lg.webp";
import Image from "next/image";
import React from "react";
import estimateIcon from "@/assets/icon/etc/icon-estimate.webp";
import defaultProfile from "@/assets/img/mascot/moverprofile-lg.webp";
import { useTranslations } from "next-intl";
import { formatDateByLanguage } from "@/utils/dateUtils";

import { IWrittenCardData } from "@/types/review";

type WrittenMoverCardProps = Omit<IWrittenCardData, "moverId">;

const WrittenMoverCard = ({
  profileImage,
  nickname,
  moveType,
  isDesigned,
  moverIntroduction,
  fromAddress,
  toAddress,
  moveDate,
  rating,
  content,
  createdAt,
}: WrittenMoverCardProps) => {
  const t = useTranslations("review");

  return (
    <div className="mb-6 flex w-full max-w-[350px] min-w-[350px] flex-col gap-2 rounded-2xl bg-white p-6 shadow-lg md:max-w-[600px] md:p-10 lg:w-[1120px] lg:max-w-none lg:justify-between">
      <div className="flex flex-col gap-y-1 md:gap-y-1">
        <div className="flex gap-2 md:hidden">
          <MoveTypeLabel type={moveType.toLowerCase() as "small" | "home" | "office"} />
          {isDesigned && <MoveTypeLabel type="document" />}
        </div>
        <div className="flex flex-row items-start justify-between">
          {/* 프로필 이미지 */}
          <Image
            src={profileImage || defaultProfile}
            alt="프로필"
            width={56}
            height={56}
            className="order-2 rounded-xl border border-gray-200 object-cover md:order-1 md:w-[80px]"
          />
          {/* 텍스트 영역 */}
          <div className="order-1 mt-3 ml-0 flex-1 md:order-2 md:mt-0 md:ml-4">
            <div className="flex flex-col items-start md:flex-row md:items-center md:gap-1">
              <Image src={estimateIcon} alt={t("verifiedDriver")} className="h-4 w-3" />
              <div className="text-lg font-bold">{nickname} {t("driverSuffix")}</div>
            </div>
            <div className="hidden max-w-[180px] truncate text-sm text-gray-500 md:block">{moverIntroduction}</div>
            <div className="hidden md:my-1 md:flex md:gap-2">
              <MoveTypeLabel type={moveType.toLowerCase() as "small" | "home" | "office"} />
              {isDesigned && <MoveTypeLabel type="document" />}
            </div>
          </div>
        </div>

        <div className="mt-2 flex flex-col border-y-1 border-gray-100 py-3 text-[13px] font-normal md:border-y-0 md:text-[14px]">
          <div className="mb-2 flex w-full gap-2">
            <div className="flex gap-3">
              <div className="flex flex-col items-start">
                <div className="text-gray-500">{t("departure")}</div>
                <div className="text-black-500">{fromAddress.city}</div>
              </div>
              <div className="flex flex-col items-start border-gray-100 px-3 md:border-x-2">
                <div className="text-gray-500">{t("arrival")}</div>
                <div className="text-black-500">{toAddress.city}</div>
              </div>
            </div>

            <div className="flex flex-col items-start md:px-3">
              <div className="text-gray-500">{t("moveDate")}</div>
              <div className="text-black-500">{formatDateByLanguage(moveDate, "ko")}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2 text-[16px] font-normal lg:text-[18px]">
        <div className="flex py-1">
          {[1, 2, 3, 4, 5].map((n) =>
            n <= rating ? (
              <Image key={n} src={StarFill} alt="별점" width={20} height={20} />
            ) : (
              <Image key={n} src={Star} alt="빈 별점" width={20} height={20} />
            ),
          )}
        </div>
        <p className="line-clamp-4 text-start md:line-clamp-3 lg:line-clamp-2">{content}</p>
      </div>

      <div className="flex justify-end text-[12px] text-gray-300 md:hidden">
        <span>{t("writeDate")} </span>
        <span>{formatDateByLanguage(createdAt, "ko")}</span>
      </div>
    </div>
  );
};

export default WrittenMoverCard;
