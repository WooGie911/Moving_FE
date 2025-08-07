"use client";

import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useAuth } from "@/providers/AuthProvider";
import { IMoverInfo } from "@/types/mover.types";
import findMoverApi from "@/lib/api/findMover.api";
import MoverList from "@/components/searchMover/MoverList";
import FavoriteMoverList from "@/components/searchMover/FavoriteMoverList";
import SearchBar from "@/components/searchMover/SearchBar";
import FilterBar from "@/components/searchMover/FilterBar";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useMoverList, useFavoriteMovers } from "@/hooks/useMoverData";
import { useSearchMoverStore } from "@/stores/searchMoverStore";

const SearchMoverPage = () => {
  const deviceType = useWindowWidth();
  const { user, isLoggedIn } = useAuth();
  const t = useTranslations("mover");
  const locale = useLocale();
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const [favoriteMovers, setFavoriteMovers] = useState<IMoverInfo[]>([]);
  const [loading, setLoading] = useState(false);

  // 쿼리 파라미터
  const queryParams = {
    region,
    serviceTypeId,
    search,
    sort,
    take: 4,
  };

  // 기사님 리스트와 찜한 기사님 데이터 가져오기
  const { isLoading: moversLoading } = useMoverList(queryParams);
  const { isLoading: favoritesLoading } = useFavoriteMovers();

  // 전체 로딩 상태 계산
  const isOverallLoading =
    moversLoading || (deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER" && favoritesLoading);

  useEffect(() => {
    if (deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER") {
      setLoading(true);
      findMoverApi
        .fetchFavoriteMovers(3, undefined, locale) // 언어 파라미터 추가
        .then((data) => setFavoriteMovers(data.items)) // items만 추출
        .catch(() => setFavoriteMovers([]))
        .finally(() => setLoading(false));
    } else {
      setFavoriteMovers([]);
    }
  }, [deviceType, isLoggedIn, user, locale]);

  const shouldShowBookmarked =
    deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER" && favoriteMovers.length > 0;

  // 전체 로딩 중일 때 MovingTruckLoader 표시
  if (isOverallLoading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <MovingTruckLoader size="lg" loadingText="기사님을 찾는 중..." />
      </div>
    );
  }

  return (
    <div
      className={`mx-auto flex max-w-[327px] justify-center md:max-w-[600px] lg:${shouldShowBookmarked ? "max-w-[1200px]" : "max-w-[820px]"}`}
    >
      <div className="flex flex-1 flex-col items-center">
        {/* 제목 */}
        {deviceType === "desktop" ? (
          <div className="w-full py-8">
            <h1 className="text-black-500 text-left font-bold lg:text-2xl">{t("title")}</h1>
          </div>
        ) : (
          <div className="py-[6px] md:py-[5px] lg:py-0"></div>
        )}

        {/* 검색바 */}
        <SearchBar />

        {/* 필터바 */}
        <FilterBar />

        {/* 기사님 리스트 */}
        <MoverList />
      </div>
      {/* PC 화면에서만 찜한 기사님 표시 */}
      {shouldShowBookmarked && <FavoriteMoverList />}
    </div>
  );
};

export default SearchMoverPage;
