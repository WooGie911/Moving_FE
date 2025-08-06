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

const FavoriteMoverPage = () => {
  const t = useTranslations("favoriteMover");
  const locale = useLocale();
  const [deleting, setDeleting] = useState(false);
  const [selectedMovers, setSelectedMovers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // 무한스크롤을 위한 intersection observer
  const { ref, inView } = useInView();

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

  // 무한스크롤 찜한 기사님 조회
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useInfiniteFavoriteMovers(
    3,
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

    try {
      setDeleting(true);

      // 선택된 기사님들의 찜하기 제거
      const deletePromises = Array.from(selectedMovers).map((moverId) => findMoverApi.removeFavorite(moverId));
      await Promise.all(deletePromises);

      // 선택 상태 초기화
      setSelectedMovers(new Set());
      setSelectAll(false);

      // 성공 토스트 표시
      showSuccessToast(`${selectedMovers.size}${t("deleteSuccess")}`);
    } catch (error) {
      console.error("선택된 항목 삭제 실패:", error);
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
    <div className="flex min-w-[375px] flex-col">
      <SectionHeader>
        <div className="flex h-full w-full items-center justify-between px-[30px] md:px-18 lg:px-90">
          <h1 className="text-2lg leading-2lg text-black-500 font-semibold">{t("title")}</h1>
        </div>
      </SectionHeader>
      <section className="min-h-screen bg-gray-100 pt-[22px]">
        <div className="mx-auto mb-[10px] flex w-[327px] items-center justify-between md:w-150 lg:w-[814px]">
          <div className="flex items-center gap-2">
            <button
              className={`h-5 w-5 rounded-[4px] border border-gray-200 ${selectAll ? "bg-primary-400" : "bg-gray-50"}`}
              onClick={handleSelectAll}
            />
            <span className="text-md text-black-300 leading-6 font-normal md:text-base">
              {t("selectAll")}({selectedMovers.size}/{allFavoriteMovers.length})
            </span>
          </div>
          {selectedMovers.size > 0 && (
            <span
              className="text-md cursor-pointer leading-6 font-normal text-gray-400 hover:underline md:text-base"
              onClick={handleDeleteSelected}
            >
              {deleting ? t("deleting") : t("deleteSelected")}
            </span>
          )}
        </div>

        {isLoading ? (
          <div className="min-h-screen bg-gray-200">
            <MovingTruckLoader size="lg" loadingText={t("estimateRequest.loadingText")} />
          </div>
        ) : allFavoriteMovers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2 text-lg font-medium">{t("noFavorites")}</p>
            <p className="text-sm">{t("noFavoritesDesc")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {allFavoriteMovers.map((mover) => (
              <div key={mover.id} className="relative">
                <MoverCard
                  mover={mover}
                  variant="favorite-responsive"
                  showBadge={true}
                  isSelected={selectedMovers.has(mover.id.toString())}
                  onSelect={handleSelectMover}
                />
              </div>
            ))}

            {/* 무한스크롤 트리거 */}
            {hasNextPage && (
              <div ref={ref} className="flex w-full justify-center py-4">
                {isFetchingNextPage ? (
                  <MovingTruckLoader size="md" loadingText={t("loadingMore")} />
                ) : (
                  <div className="h-4" /> // 트리거용 빈 공간
                )}
              </div>
            )}
          </div>
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
    </div>
  );
};

export default FavoriteMoverPage;
