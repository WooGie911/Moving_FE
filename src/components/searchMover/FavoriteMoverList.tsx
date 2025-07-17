"use client";

import React from "react";
import { FavoriteMoverListProps } from "@/types/findMover";
import Link from "next/link";
import Image from "next/image";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import defaultProfileSm from "@/assets/img/mascot/profile-sm.png";
import badge from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import like from "@/assets/icon/like/icon-like-red.png";

const FavoriteMoverList = ({ movers }: FavoriteMoverListProps) => {
  if (!movers || movers.length === 0) return null;

  return (
    <div className="mt-[288px] ml-[54px] flex flex-col">
      <h2 className="mb-4 text-xl font-semibold text-gray-900">찜한 기사님</h2>
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
                  <MoveTypeLabel
                    key={index}
                    type={
                      serviceType.service?.name === "소형이사"
                        ? "small"
                        : serviceType.service?.name === "가정이사"
                          ? "home"
                          : serviceType.service?.name === "사무실이사"
                            ? "office"
                            : "document"
                    }
                  />
                ))}
              </div>

              <div className="flex flex-col gap-4">
                <div>
                  <div className="text-4 line-clamp-1 leading-[26px] font-semibold">{mover.description}</div>
                </div>

                <div className="flex gap-2">
                  <Image src={defaultProfileSm} alt="profile-img" width={50} height={50} />
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />
                        <span className="text-[14px] leading-6 font-semibold">{mover.nickname} 기사님</span>
                      </div>
                      <div className="flex items-center gap-[7px]">
                        <Image src={like} alt="like-img" className="h-3 w-[14px]" />
                        <span className="text-[14px] font-normal text-gray-600">{mover.favoriteCount}</span>
                      </div>
                    </div>
                    <div className={`flex items-center ${mover.experience >= 10 ? "gap-1.5" : "gap-2"}`}>
                      <div className="flex items-center gap-0.5">
                        <Image src={star} alt="star-img" className="h-5 w-5" />
                        <span className="text-[13px] leading-[22px] font-medium">{mover.avgRating.toFixed(1)}</span>
                        <span className="text-[13px] font-medium text-[#ababab]">({mover.reviewCount})</span>
                      </div>
                      <span className="text-[#e6e6e6]">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">경력</span>
                        <span className="text-[13px] leading-[22px] font-medium">{mover.experience}년</span>
                      </div>
                      <span className="text-[#e6e6e6]">|</span>
                      <div className="flex items-center gap-1">
                        <span className="text-[13px] leading-[22px] font-medium">{mover.completedCount}건</span>
                        <span className="text-[13px] leading-[22px] font-medium text-[#ababab]">확정</span>
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
