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
import * as Sentry from "@sentry/nextjs";

const SearchMoverPage = () => {
  const deviceType = useWindowWidth();
  const { user, isLoggedIn } = useAuth();
  const t = useTranslations("mover");
  const locale = useLocale();
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const [favoriteMovers, setFavoriteMovers] = useState<IMoverInfo[]>([]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    Sentry.setContext("SearchMoverPage", {
      deviceType,
      userType: user?.userType || "anonymous",
      isLoggedIn,
    });
  }, [deviceType, user?.userType, isLoggedIn]);

  const queryParams = {
    region,
    serviceTypeId,
    search,
    sort,
    take: 4,
  };

  const { isLoading: moversLoading } = useMoverList(queryParams);
  const { isLoading: favoritesLoading } = useFavoriteMovers();

  const isOverallLoading =
    moversLoading || (deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER" && favoritesLoading);

  useEffect(() => {
    if (deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER") {
      setLoading(true);
      findMoverApi
        .fetchFavoriteMovers(3, undefined, locale)
        .then((data) => setFavoriteMovers(data.items))
        .catch((error) => {
          Sentry.captureException(error, {
            tags: {
              component: "SearchMoverPage",
              action: "fetchFavoriteMovers",
            },
            extra: {
              userId: user?.id,
              locale,
              deviceType,
            },
          });
          setFavoriteMovers([]);
        })
        .finally(() => setLoading(false));
    } else {
      setFavoriteMovers([]);
    }
  }, [deviceType, isLoggedIn, user, locale]);

  const shouldShowBookmarked =
    deviceType === "desktop" && isLoggedIn && user?.userType === "CUSTOMER" && favoriteMovers.length > 0;

  if (isOverallLoading) {
    return (
      <main className="min-h-screen bg-gray-200" role="main" aria-live="polite" aria-label="기사님 정보 로딩중">
        <MovingTruckLoader size="lg" loadingText={t("loadingMoverInfo")} />
      </main>
    );
  }

  return (
    <main
      className={`mx-auto flex max-w-[327px] justify-center md:max-w-[600px] lg:${shouldShowBookmarked ? "max-w-[1200px]" : "max-w-[820px]"}`}
      role="main"
    >
      {/* 스킵 링크 - 웹 접근성을 위한 키보드 네비게이션 */}
      <nav className="sr-only focus-within:not-sr-only" aria-label="빠른 이동 메뉴">
        <a
          href="#search-section"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          검색으로 바로가기
        </a>
        <a
          href="#mover-list-section"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 ml-2 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          기사님 목록으로 바로가기
        </a>
      </nav>

      <section className="flex min-h-screen flex-1 flex-col items-center" aria-labelledby="page-title">
        {/* 페이지 제목 */}
        {deviceType === "desktop" ? (
          <header className="w-full py-8">
            <h1
              id="page-title"
              className="text-black-500 text-left font-bold lg:text-2xl"
              role="heading"
              aria-level={1}
            >
              {t("title")}
            </h1>
          </header>
        ) : (
          <div className="py-[6px] md:py-[5px] lg:py-0" aria-hidden="true"></div>
        )}

        {/* 검색 및 필터 섹션 */}
        <section id="search-section" aria-labelledby="search-title" role="search">
          <h2 id="search-title" className="sr-only">
            기사님 검색 및 필터
          </h2>

          {/* 검색바 */}
          <div role="group" aria-labelledby="search-input-label">
            <span id="search-input-label" className="sr-only">
              기사님 검색
            </span>
            <SearchBar />
          </div>

          {/* 필터바 */}
          <div role="group" aria-labelledby="filter-label">
            <span id="filter-label" className="sr-only">
              검색 필터 옵션
            </span>
            <FilterBar />
          </div>
        </section>

        {/* 기사님 목록 섹션 */}
        <section id="mover-list-section" aria-labelledby="mover-list-title" role="region">
          <h2 id="mover-list-title" className="sr-only">
            검색된 기사님 목록
          </h2>
          <MoverList />
        </section>
      </section>

      {/* PC 화면에서만 찜한 기사님 표시 */}
      {shouldShowBookmarked && (
        <aside
          role="complementary"
          aria-labelledby="favorite-movers-title"
          aria-describedby="favorite-movers-description"
        >
          <h2 id="favorite-movers-title" className="sr-only">
            찜한 기사님 목록
          </h2>
          <span id="favorite-movers-description" className="sr-only">
            회원님이 찜하신 기사님들의 목록입니다.
          </span>
          <FavoriteMoverList />
        </aside>
      )}
    </main>
  );
};

export default SearchMoverPage;
