"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import { useMoverList } from "@/hooks/useMoverData";
import MoverCard from "./MoverCard";

const MoverList = () => {
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const t = useTranslations("mover");
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowScrollTop(scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 맨 위로 스크롤하는 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 쿼리 파라미터 메모이제이션
  const queryParams = useMemo(
    () => ({
      region,
      serviceTypeId,
      search,
      sort,
      take: 4,
    }),
    [region, serviceTypeId, search, sort],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isError, error } = useMoverList(queryParams);

  // 모든 페이지의 데이터를 평탄화
  const allMovers = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.items);
  }, [data?.pages]);

  // 무한 스크롤 처리
  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-12 lg:w-205">
        <div className="mb-4 text-lg text-red-500">{t("errorTitle")}</div>
        <div className="text-sm text-gray-500">{error?.message || t("errorMessage")}</div>
      </div>
    );
  }

  if (!allMovers.length) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center py-12 lg:w-205">
        <div className="mb-2 text-lg text-gray-500">{t("noSearchResult")}</div>
        <div className="text-sm text-gray-400">{t("tryOtherSearch")}</div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-10 space-y-6 lg:space-y-5">
        {allMovers.map((mover, index) => (
          <MoverCard key={`${mover.id}-${index}`} mover={mover} variant="list" />
        ))}

        {/* 무한스크롤 감지용 div */}
        <div ref={ref} style={{ height: 1 }} />

        {isFetchingNextPage && <div className="py-4 text-center text-gray-500">{t("loadingMoverInfo")}</div>}
      </div>

      {/* 맨 위로 올라가는 버튼 */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hover:bg-primary-400 fixed bottom-6 left-1/2 z-50 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-lg transition-all hover:scale-110 hover:text-white"
          aria-label="맨 위로 올라가기"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

export default MoverList;
