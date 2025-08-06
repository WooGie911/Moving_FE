"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useAuth } from "@/providers/AuthProvider";
import { useMoverList, useFavoriteMovers } from "@/hooks/useMoverData";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import MoverList from "@/components/searchMover/MoverList";
import FavoriteMoverList from "@/components/searchMover/FavoriteMoverList";
import SearchBar from "@/components/searchMover/SearchBar";
import FilterBar from "@/components/searchMover/FilterBar";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

const SearchMoverPage = () => {
  const deviceType = useWindowWidth();
  const { user, isLoggedIn } = useAuth();
  const t = useTranslations("mover");
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();

  const shouldShowBookmarked = deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER";

  // 기사님 목록 조회
  const { isLoading: moversLoading } = useMoverList({
    region,
    serviceTypeId,
    search,
    sort,
    take: 4,
  });

  // 찜한 기사님 조회 
  const { isLoading: favoritesLoading } = useFavoriteMovers();

  // 전체 로딩 상태
  const isOverallLoading = moversLoading || (shouldShowBookmarked && favoritesLoading);

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
