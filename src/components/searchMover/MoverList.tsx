"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Link from "next/link";
import Image from "next/image";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import { IMoverInfo } from "@/types/mover.types";
import findMoverApi from "@/lib/api/findMover.api";
import defaultProfileLg from "@/assets/img/mascot/profile-lg.png";
import defaultProfileSm from "@/assets/img/mascot/profile-sm.png";
import badge from "@/assets/icon/etc/icon-chat.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import like from "@/assets/icon/like/icon-like-red.png";

const MoverList = () => {
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const [movers, setMovers] = useState<IMoverInfo[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const deviceType = useWindowWidth();

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  useEffect(() => {
    setMovers([]);
    setNextCursor(undefined);
    setHasNext(true);
    setError(null);
    fetchMore(true);
  }, [region, serviceTypeId, search, sort]);

  const fetchMore = useCallback(
    async (isInit = false) => {
      if (loading || (!isInit && !hasNext)) return;
      setLoading(true);
      try {
        const params = {
          region,
          serviceTypeId,
          search,
          sort,
          cursor: isInit ? undefined : nextCursor,
          take: 2,
        };

        const result = await findMoverApi.fetchMovers(params);
        if (result.items.length === 0) {
          setHasNext(false);
          setLoading(false);
          return;
        }
        setMovers((prev) => {
          const all = isInit ? result.items : [...prev, ...result.items];
          const unique = Array.from(new Map(all.map((item) => [item.id, item])).values());
          return unique;
        });
        setNextCursor(result.nextCursor ?? undefined);
        setHasNext(result.hasNext);
      } catch (err) {
        console.error("[MoverList] API 호출 실패:", err);
        setError("기사님 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setLoading(false);
      }
    },
    [region, serviceTypeId, search, sort, loading],
  );

  useEffect(() => {
    if (inView && hasNext && !loading) {
      fetchMore();
    }
  }, [inView, hasNext, loading, fetchMore]);

  if (loading && movers.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 lg:w-205">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">기사님 정보를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (error && movers.length === 0) {
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
              <div
                className="max-h-[226px] w-[327px] rounded-2xl border-[0.5px] border-[#f2f2f2] p-5"
                style={{
                  boxShadow: "2px 2px 10px 0px #DCDCDC33, -2px -2px 10px 0px #DCDCDC33",
                }}
              >
                <div className="mb-2 flex flex-wrap gap-2 md:mb-3">
                  {mover.serviceTypes.map((serviceType, index) => {
                    const serviceName =
                      typeof serviceType === "string"
                        ? serviceType === "SMALL"
                          ? "소형이사"
                          : serviceType === "HOME"
                            ? "가정이사"
                            : serviceType === "OFFICE"
                              ? "사무실이사"
                              : "기타"
                        : serviceType.service?.name || "기타";

                    return (
                      <MoveTypeLabel
                        key={index}
                        type={
                          serviceName === "소형이사"
                            ? "small"
                            : serviceName === "가정이사"
                              ? "home"
                              : serviceName === "사무실이사"
                                ? "office"
                                : "document"
                        }
                      />
                    );
                  })}
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
                    <Image
                      src={mover.profileImage || defaultProfileSm}
                      alt="profile-img"
                      width={50}
                      height={50}
                      className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] flex-shrink-0 rounded-[12px] object-cover"
                    />
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
                      {mover.serviceTypes.map((serviceType, index) => {
                        // 백엔드에서 문자열 배열로 오는 경우와 객체로 오는 경우 모두 처리
                        const serviceName =
                          typeof serviceType === "string"
                            ? serviceType === "SMALL"
                              ? "소형이사"
                              : serviceType === "HOME"
                                ? "가정이사"
                                : serviceType === "OFFICE"
                                  ? "사무실이사"
                                  : "기타"
                            : serviceType.service?.name || "기타";

                        return (
                          <MoveTypeLabel
                            key={index}
                            type={
                              serviceName === "소형이사"
                                ? "small"
                                : serviceName === "가정이사"
                                  ? "home"
                                  : serviceName === "사무실이사"
                                    ? "office"
                                    : "document"
                            }
                          />
                        );
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
                            <Image src={badge} alt="icon-chat" className="h-[23px] w-5" />
                            <div className="text-4 leading-[26px] font-semibold">{mover.nickname} 기사님</div>
                          </div>
                          <div className="flex items-center justify-between md:w-[390px] lg:w-[610px]">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-0.5">
                                <Image src={star} alt="star-img" className="h-5 w-5" />
                                <span className="text-[13px] leading-[22px] font-medium">
                                  {mover.avgRating.toFixed(1)}
                                </span>
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
      {/* 무한스크롤 감지용 div */}
      <div ref={ref} style={{ height: 1 }} />
      {loading && <div className="py-4 text-center text-gray-500">로딩중...</div>}
    </div>
  );
};

export default MoverList;
