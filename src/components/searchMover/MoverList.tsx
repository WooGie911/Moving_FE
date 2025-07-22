"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverInfo } from "@/types/findMover";
import defaultProfileLg from "@/assets/img/mascot/profile-lg.png";
import defaultProfileSm from "@/assets/img/mascot/profile-sm.png";
import badge from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import like from "@/assets/icon/like/icon-like-red.png";

const MoverList = () => {
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const [movers, setMovers] = useState<IMoverInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceType = useWindowWidth();

  useEffect(() => {
    const fetchMovers = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await findMoverApi.fetchMovers({ region, serviceTypeId, search, sort });
        setMovers(data);
      } catch (err) {
        console.error("기사님 조회 실패:", err);
        setError("기사님 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
        setMovers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMovers();
  }, [region, serviceTypeId, search, sort]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 lg:w-205">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">기사님 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 lg:w-205">
        <div className="mb-4 text-lg text-red-500">오류가 발생했습니다</div>
        <div className="text-sm text-gray-500">{error}</div>
      </div>
    );
  }

  if (!movers.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 lg:w-205">
        <div className="mb-2 text-lg text-gray-500">검색 결과가 없습니다</div>
        <div className="text-sm text-gray-400">다른 검색어나 필터를 시도해보세요</div>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-6 lg:space-y-5">
      {movers.map((mover) => {
        const defaultProfile = deviceType === "mobile" ? defaultProfileSm : defaultProfileLg;
        return (
          <Link key={mover.id} href={`/searchMover/${mover.id}`} className="block">
            {deviceType === "mobile" ? (
              // 모바일
              <div
                className="max-h-[226px] w-[327px] rounded-2xl border-[0.5px] border-[#f2f2f2] p-5"
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
                    <div className="line-clamp-1 text-[13px] leading-[22px] font-medium text-gray-600">
                      {mover.introduction}
                    </div>
                  </div>

                  <div className="h-[1px] w-[287px] border border-[#f2f2f2]"></div>

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
                          {/* <span className="text-[13px] leading-[22px] font-medium">{mover.avgRating.toFixed(1)}</span> */}
                          <span className="text-[13px] leading-[22px] font-medium">{mover.avgRating}</span>
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
            ) : (
              // 태블릿/데스크탑
              <div className="gap-5">
                <div
                  className="rounded-2xl border-[0.5px] border-[#f2f2f2] p-5 md:h-[230px] md:w-[600px] md:px-6 md:py-7 lg:h-[230px] lg:w-[820px] lg:rounded-[20px]"
                  style={{
                    boxShadow: "2px 2px 10px 0px #DCDCDC33, -2px -2px 10px 0px #DCDCDC33",
                  }}
                >
                  <div className="w-full">
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

                    <div className="flex gap-2 md:gap-5">
                      <Image
                        src={defaultProfile}
                        alt="profile-image"
                        width={deviceType === "desktop" || deviceType === "tablet" ? 134 : 50}
                        height={deviceType === "desktop" || deviceType === "tablet" ? 134 : 50}
                      />
                      <div>
                        <div className="mb-5">
                          <div className="text-5 line-clamp-1 leading-8 font-semibold">{mover.description}</div>
                          <div className="text-[14px] leading-6 font-normal text-gray-600">{mover.introduction}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />
                            <div className="text-4 leading-[26px] font-semibold">{mover.nickname} 기사님</div>
                          </div>
                          <div className="flex items-center justify-between md:w-[390px] lg:w-[610px]">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                <Image src={star} alt="star-img" className="h-5 w-5" />
                                {/* <span className="text-[13px] leading-[22px] font-medium">
                                  {mover.avgRating.toFixed(1)}
                                </span> */}

                                <span className="text-[13px] leading-[22px] font-medium">{mover.avgRating}</span>
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
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MoverList;
