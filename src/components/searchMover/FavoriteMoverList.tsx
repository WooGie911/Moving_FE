"use client";

import React from "react";
import { useTranslations } from "next-intl";
import type { FavoriteMoverListProps } from "@/types/mover.types";
import Link from "next/link";
import Image from "next/image";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import { getServiceTypeForLabel } from "@/lib/utils/translationUtils";
import defaultProfileSm from "@/assets/img/mascot/profile-sm.png";
import badge from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import like from "@/assets/icon/like/icon-like-red.png";

const FavoriteMoverList = ({ movers }: FavoriteMoverListProps) => {
  const t = useTranslations("mover");

  if (!movers || movers.length === 0) return null;

  return (
    <div className="mt-[288px] ml-[54px] flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("favoriteMoversTitle")}</h2>
      <div className="space-y-4">
        {movers.map((mover) => (
          <Link key={mover.id} href={`/searchMover/${mover.id}`} className="block">
            <div
              className="max-h-[542px] w-[327px] rounded-2xl border-[0.5px] border-[#f2f2f2] p-5"
              style={{
                boxShadow: "2px 2px 10px 0px #DCDCDC33, -2px -2px 10px 0px #DCDCDC33",
              }}
            >
              <div className="mb-2 flex flex-wrap gap-2 md:mb-3">
                {mover.serviceTypes.map((serviceType, index) => (
                  <MoveTypeLabel key={index} type={getServiceTypeForLabel(serviceType.service?.name || "기타")} />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-4 line-clamp-1 leading-[26px] font-semibold">{mover.description}</div>
                </div>

                <div className="flex gap-2">
                  <Image
                    src={mover.profileImage || defaultProfileSm}
                    alt="profile-img"
                    width={50}
                    height={50}
                    className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] flex-shrink-0 rounded-[12px] object-cover"
                  />
                  <div className="flex w-[229px] flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />
                        <span className="text-[14px] leading-6 font-semibold">
                          {mover.nickname} {t("driverSuffix")}
                        </span>
                      </div>
                      <div className="flex items-center gap-[7px]">
                        <Image src={like} alt="like-img" className="h-3 w-[14px]" />
                        <span className="text-[14px] font-normal text-gray-600">{mover.favoriteCount || 0}</span>
                      </div>
                    </div>
                    <div className={`flex items-center ${mover.experience >= 10 ? "gap-1.5" : "gap-2"}`}>
                      <div className="flex items-center justify-between">
                        <Image src={star} alt="star-img" className="h-5 w-5" />
                        <span className="text-[13px] leading-[22px] font-medium">
                          {mover.avgRating ? Number(mover.avgRating).toFixed(1) : "0.0"}
                        </span>
                        <span className="text-[13px] font-medium text-[#ababab]">({mover.reviewCount || 0})</span>
                      </div>
                      <span className="text-[#e6e6e6]">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">
                          {t("experienceFavorite")}
                        </span>
                        <span className="text-[13px] leading-[22px] font-medium">
                          {mover.experience || 0}
                          {t("yearsFavorite")}
                        </span>
                      </div>
                      <span className="text-[#e6e6e6]">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] leading-[22px] font-medium">
                          {mover.completedCount || 0}
                          {t("casesFavorite")}
                        </span>
                        <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">
                          {t("confirmedFavorite")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default FavoriteMoverList;
