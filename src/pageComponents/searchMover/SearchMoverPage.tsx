"use client";

import React from "react";
import { useTranslations } from "next-intl";
import SearchBar from "@/components/searchMover/SearchBar";
import FilterBar from "@/components/searchMover/FilterBar";
import MoverList from "@/components/searchMover/MoverList";
import FavoriteMoverList from "@/components/searchMover/FavoriteMoverList";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { useAuth } from "@/providers/AuthProvider";
import findMoverApi from "@/lib/api/findMover.api";
import { useEffect, useState } from "react";
import { IMoverInfo } from "@/types/findMover";

const SearchMoverPage = () => {
  const deviceType = useWindowWidth();
  const { user, isLoggedIn } = useAuth();
  const t = useTranslations("mover");
  const [favoriteMovers, setFavoriteMovers] = useState<IMoverInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER") {
      setLoading(true);
      findMoverApi
        .fetchFavoriteMovers()
        .then((data) => setFavoriteMovers(data))
        .catch(() => setFavoriteMovers([]))
        .finally(() => setLoading(false));
    } else {
      setFavoriteMovers([]);
    }
  }, [deviceType, isLoggedIn, user]);

  const shouldShowBookmarked =
    deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER" && favoriteMovers.length > 0;

  return (
    <div
      className={`mx-auto flex max-w-[327px] justify-center md:max-w-[600px] lg:${shouldShowBookmarked ? "max-w-[1200px]" : "max-w-[820px]"}`}
    >
      <div className="flex flex-col items-center">
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
      {shouldShowBookmarked && <FavoriteMoverList movers={favoriteMovers} />}
    </div>
  );
};

export default SearchMoverPage;
