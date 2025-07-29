"use client";

import React from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IMoverInfo } from "@/types/mover.types";
import { getServiceTypeForLabel } from "@/lib/utils/translationUtils";
import defaultProfileLg from "@/assets/img/mascot/profile-lg.png";
import defaultProfileSm from "@/assets/img/mascot/profile-sm.png";
import badge from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import like from "@/assets/icon/like/icon-like-red.png";

interface MoverCardProps {
  mover: IMoverInfo;
  variant?: "list" | "favorite";
  showBadge?: boolean;
}

const MoverCard = ({ mover, variant = "list", showBadge = true }: MoverCardProps) => {
  const deviceType = useWindowWidth();
  const t = useTranslations("mover");
  const defaultProfile = deviceType === "mobile" ? defaultProfileSm : defaultProfileLg;

  const shouldShowBadge = showBadge && mover.completedCount > 30;

  const renderMobileCard = () => (
    <div
      className={`${variant === "favorite" ? "max-h-[542px]" : "max-h-[250px]"} w-[327px] rounded-2xl border-[0.5px] border-[#f2f2f2] p-5`}
      style={{
        boxShadow: "2px 2px 10px 0px #DCDCDC33, -2px -2px 10px 0px #DCDCDC33",
      }}
    >
      <div className="mb-3 flex flex-wrap gap-2 md:mb-3">
        {mover.serviceTypes.map((serviceType, index) => {
          const serviceName = typeof serviceType === "string" ? serviceType : serviceType.service?.name || "기타";
          return <MoveTypeLabel key={index} type={getServiceTypeForLabel(serviceName)} />;
        })}
      </div>

      <div className={`flex flex-col ${variant === "favorite" ? "gap-4" : "gap-3"}`}>
        <div>
          <div className="text-4 line-clamp-1 leading-[26px] font-semibold">{mover.description}</div>
          {variant === "list" && (
            <div className="line-clamp-1 text-[13px] leading-[22px] font-medium text-gray-600">
              {mover.introduction}
            </div>
          )}
        </div>

        {variant === "list" && <div className="h-[1px] w-[287px] border border-[#f2f2f2]"></div>}

        <div className="flex gap-2">
          <Image
            src={mover.profileImage || defaultProfileSm}
            alt="profile-img"
            width={50}
            height={50}
            className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] flex-shrink-0 rounded-[12px] object-cover"
          />
          <div className={`flex flex-col gap-1 ${variant === "favorite" ? "w-[229px]" : ""}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                {shouldShowBadge && <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />}
                <span className="text-[14px] leading-6 font-semibold">
                  {mover.nickname} {t("driverSuffix")}
                </span>
              </div>
              <div className="flex items-center gap-[7px]">
                <Image src={like} alt="like-img" className="h-3 w-[14px]" />
                <span className="text-[14px] font-normal text-gray-600">{mover.favoriteCount}</span>
              </div>
            </div>
            <div
              className={`flex items-center ${variant === "favorite" && mover.experience >= 10 ? "gap-1.5" : "gap-2"}`}
            >
              <div className="flex items-center gap-0.5">
                <Image src={star} alt="star-img" className="h-5 w-5" />
                <span className="text-[13px] leading-[22px] font-medium">
                  {mover.avgRating ? Number(mover.avgRating).toFixed(1) : "0.0"}
                </span>
                <span className="text-[13px] font-medium text-[#ababab]">({mover.reviewCount || 0})</span>
              </div>
              <span className="text-[#e6e6e6]">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">
                  {variant === "favorite"
                    ? t("experienceFavorite")
                    : deviceType === "mobile"
                      ? t("experienceMobile") || "经验"
                      : t("experience")}
                </span>
                <span className="text-[13px] leading-[22px] font-medium">
                  {mover.experience || 0}
                  {variant === "favorite"
                    ? t("yearsFavorite")
                    : deviceType === "mobile"
                      ? t("yearsMobile") || "年"
                      : t("years")}
                </span>
              </div>
              <span className="text-[#e6e6e6]">|</span>
              <div className="flex items-center gap-1">
                <span className="text-[13px] leading-[22px] font-medium">
                  {mover.completedCount || 0}
                  {variant === "favorite"
                    ? t("casesFavorite")
                    : deviceType === "mobile"
                      ? t("casesMobile") || ""
                      : t("cases")}
                </span>
                <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">
                  {variant === "favorite"
                    ? t("confirmedFavorite")
                    : deviceType === "mobile"
                      ? t("confirmedMobile") || "完成"
                      : t("confirmed")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDesktopCard = () => (
    <div className="gap-5">
      <div
        className="rounded-2xl border-[0.5px] border-[#f2f2f2] p-5 md:h-[230px] md:w-[600px] md:px-6 md:py-7 lg:h-[230px] lg:w-[820px] lg:rounded-[20px]"
        style={{
          boxShadow: "2px 2px 10px 0px #DCDCDC33, -2px -2px 10px 0px #DCDCDC33",
        }}
      >
        <div className="w-full">
          <div className="mb-2 flex flex-wrap gap-2 md:mb-3">
            {mover.serviceTypes.map((serviceType, index) => {
              const serviceName = typeof serviceType === "string" ? serviceType : serviceType.service?.name || "기타";
              return <MoveTypeLabel key={index} type={getServiceTypeForLabel(serviceName)} />;
            })}
          </div>

          <div className="flex gap-2 md:gap-5">
            <Image
              src={mover.profileImage || defaultProfile}
              alt="profile-image"
              width={134}
              height={134}
              className="h-[134px] min-h-[134px] w-[134px] min-w-[134px] flex-shrink-0 rounded-[12px] object-cover"
            />
            <div>
              <div className="mb-5">
                <div className="text-5 line-clamp-1 leading-8 font-semibold">{mover.description}</div>
                <div className="text-[14px] leading-6 font-normal text-gray-600">{mover.introduction}</div>
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1">
                  {shouldShowBadge && <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />}
                  <div className="text-4 leading-[26px] font-semibold">
                    {mover.nickname} {t("driverSuffix")}
                  </div>
                </div>
                <div className="flex items-center justify-between md:w-[390px] lg:w-[610px]">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      <Image src={star} alt="star-img" className="h-5 w-5" />
                      <span className="text-[13px] leading-[22px] font-medium">{mover.avgRating.toFixed(1)}</span>
                      <span className="text-[13px] font-medium text-[#ababab]">({mover.reviewCount})</span>
                    </div>
                    <span className="text-[#e6e6e6]">|</span>
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="text-[13px] leading-[22px] font-medium whitespace-nowrap text-[#ababab]">
                        {t("experience")}
                      </span>
                      <span className="text-[13px] leading-[22px] font-medium whitespace-nowrap">
                        {mover.experience}
                        {t("years")}
                      </span>
                    </div>
                    <span className="text-[#e6e6e6]">|</span>
                    <div className="flex min-w-0 items-center gap-1">
                      <span className="text-[13px] leading-[22px] font-medium whitespace-nowrap">
                        {mover.completedCount}
                        {t("cases")}
                      </span>
                      <span className="text-[13px] leading-[22px] font-medium whitespace-nowrap text-[#ababab]">
                        {t("confirmed")}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Image src={like} alt="like-img" className="h-3 w-[14px]" />
                    <span className="text-[14px] font-normal text-gray-600">{mover.favoriteCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Link href={`/searchMover/${mover.id}`} className="block">
      {variant === "favorite" ? renderMobileCard() : deviceType === "mobile" ? renderMobileCard() : renderDesktopCard()}
    </Link>
  );
};

export default MoverCard;
