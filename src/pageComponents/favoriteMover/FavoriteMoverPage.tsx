"use client";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import SectionHeader from "@/components/common/SectionHeader";
import MoverCard from "@/components/searchMover/MoverCard";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverInfo } from "@/types/mover.types";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useInfiniteFavoriteMovers } from "@/hooks/useMoverData";
import { useInView } from "react-intersection-observer";
import { useQueryClient } from "@tanstack/react-query";

const FavoriteMoverPage = () => {
  const t = useTranslations("favoriteMover");
  const locale = useLocale();
  const [deleting, setDeleting] = useState(false);
  const [selectedMovers, setSelectedMovers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const queryClient = useQueryClient();

  // 무한스크롤을 위한 intersection observer (기사님 찾기와 동일 설정)
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "100px" });

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

  // 무한스크롤 찜한 기사님 조회 (기사님 찾기와 동일 개수)
  const FAVORITE_LIMIT = 4;
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteFavoriteMovers(
    FAVORITE_LIMIT,
    locale,
  ); // 3개씩 가져오기, 언어 파라미터 추가

  // 모든 찜한 기사님 목록을 평면화
  const allFavoriteMovers = data?.pages.flatMap((page) => page.items) || [];

  // 무한스크롤 처리
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMovers(new Set());
      setSelectAll(false);
    } else {
      setSelectedMovers(new Set(allFavoriteMovers.map((mover) => mover.id.toString())));
      setSelectAll(true);
    }
  };

  // 개별 선택/해제 핸들러
  const handleSelectMover = (moverId: string) => {
    const newSelected = new Set(selectedMovers);
    if (newSelected.has(moverId)) {
      newSelected.delete(moverId);
    } else {
      newSelected.add(moverId);
    }
    setSelectedMovers(newSelected);
    setSelectAll(newSelected.size === allFavoriteMovers.length);
  };

  // 선택된 항목 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedMovers.size === 0) return;

    // 이전 캐시 스냅샷 (롤백용)
    let previousInfiniteData: any = null;
    const deletedCount = selectedMovers.size;
    const infiniteKey: readonly [string, number, string] = ["favoriteMovers", FAVORITE_LIMIT, locale] as const;

    try {
      setDeleting(true);

      // 삭제 대상 ID 목록
      const idsToRemove = Array.from(selectedMovers);

      // 이전 캐시 스냅샷 저장 (롤백 대비)
      previousInfiniteData = queryClient.getQueryData(infiniteKey);

      // 옵티미스틱 업데이트: 현재 화면의 무한 스크롤 데이터에서 선택 항목 제거
      queryClient.setQueryData(infiniteKey, (oldData: any) => {
        if (!oldData?.pages) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: (page.items || []).filter((mover: IMoverInfo) => !idsToRemove.includes(mover.id.toString())),
          })),
        };
      });

      // 서버에 실제 삭제 요청 병렬 수행
      const deletePromises = idsToRemove.map((moverId) => findMoverApi.removeFavorite(moverId));
      await Promise.all(deletePromises);

      // 선택 상태 초기화
      setSelectedMovers(new Set());
      setSelectAll(false);

      // 성공 토스트 표시
      showSuccessToast(`${deletedCount}${t("deleteSuccess")}`);

      // 백그라운드 동기화: 관련 캐시 무효화 (preview 및 다른 한정자 포함)
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });
      queryClient.invalidateQueries({ queryKey: ["movers"] });

      // 화면에 최소 FAVORITE_LIMIT 개를 유지하려고 시도 (초기 페이지만 로딩된 경우에 한해 보충)
      const current = queryClient.getQueryData(infiniteKey) as any;
      const loadedPages = current?.pages?.length ?? 0;
      const currentCount = (current?.pages || []).reduce(
        (sum: number, page: any) => sum + ((page.items || []).length as number),
        0,
      );
      if (loadedPages === 1 && currentCount < FAVORITE_LIMIT && hasNextPage) {
        await fetchNextPage();
      }
    } catch (error) {
      // 롤백: 옵티미스틱 업데이트 복구
      if (previousInfiniteData) {
        queryClient.setQueryData(infiniteKey, previousInfiniteData as any);
      }
      // 에러 토스트 표시
      showErrorToast(t("deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  // 에러 처리
  if (isError) {
    return (
      <div className="flex min-w-[375px] flex-col">
        <SectionHeader>
          <div className="flex h-full w-full items-center justify-between px-[30px] md:px-18 lg:px-90">
            <h1 className="text-2lg leading-2lg text-black-500 font-semibold">{t("title")}</h1>
          </div>
        </SectionHeader>
        <section className="min-h-screen bg-gray-100 pt-[22px]">
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2 text-lg font-medium">{t("errorTitle")}</p>
            <p className="text-sm">{error?.message || t("errorMessage")}</p>
          </div>
        </section>
      </div>
    );
  }

  return (
    <main className="flex min-w-[375px] flex-col" role="main" aria-label={t("title")}>
      <SectionHeader>
        <div className="flex h-full w-full items-center justify-between px-[30px] md:px-18 lg:px-90">
          <h1 className="text-2lg leading-2lg text-black-500 font-semibold">{t("title")}</h1>
        </div>
      </SectionHeader>
      <section className="min-h-screen bg-gray-100 py-[22px]" aria-labelledby="favorite-list-heading">
        <h2 id="favorite-list-heading" className="sr-only">
          {t("title")}
        </h2>
        <div
          className="mx-auto mb-[10px] flex w-[327px] items-center justify-between md:w-150 lg:w-[814px]"
          role="toolbar"
          aria-label={t("title")}
        >
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              aria-label={t("selectAll")}
              className="accent-primary-400 h-5 w-5 rounded-[4px] border border-gray-300 outline-none"
              checked={selectAll}
              onChange={handleSelectAll}
            />
            <span className="text-md text-black-300 leading-6 font-normal md:text-base" aria-live="polite">
              {t("selectAll")}({selectedMovers.size}/{allFavoriteMovers.length})
            </span>
          </div>
          {selectedMovers.size > 0 && (
            <button
              type="button"
              className="text-md cursor-pointer leading-6 font-normal text-gray-400 hover:underline md:text-base"
              onClick={handleDeleteSelected}
              aria-label={deleting ? t("deleting") : t("deleteSelected")}
            >
              {deleting ? t("deleting") : t("deleteSelected")}
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="min-h-screen bg-gray-200">
            <MovingTruckLoader size="lg" loadingText={t("loadingText")} />
          </div>
        ) : allFavoriteMovers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2 text-lg font-medium">{t("noFavorites")}</p>
            <p className="text-sm">{t("noFavoritesDesc")}</p>
          </div>
        ) : (
          <ul
            className="flex flex-col items-center space-y-4"
            role="list"
            aria-busy={isFetchingNextPage || deleting}
            aria-live="polite"
          >
            {allFavoriteMovers.map((mover) => {
              const isSelected = selectedMovers.has(mover.id.toString());
              return (
                <li
                  key={mover.id}
                  className="relative flex w-full justify-center focus:outline-none focus-visible:outline-none"
                  role="listitem"
                  aria-label={`${mover.nickname || mover.name}`}
                  aria-selected={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleSelectMover(mover.id.toString());
                    }
                  }}
                >
                  <MoverCard
                    mover={mover}
                    variant="favorite-responsive"
                    showBadge={true}
                    isSelected={isSelected}
                    onSelect={handleSelectMover}
                  />
                  <span className="sr-only" aria-live="polite">
                    {isSelected ? "selected" : "not selected"}
                  </span>
                </li>
              );
            })}

            {/* 무한스크롤 트리거 */}
            {hasNextPage && (
              <div ref={ref} className="flex w-full justify-center py-4" aria-hidden="true" role="presentation">
                {isFetchingNextPage ? (
                  <MovingTruckLoader size="md" loadingText={t("loadingMore")} />
                ) : (
                  <div className="h-4" /> // 트리거용 빈 공간
                )}
              </div>
            )}
          </ul>
        )}

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
      </section>
    </main>
  );
};

export default FavoriteMoverPage;
