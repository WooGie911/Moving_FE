"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import SectionHeader from "@/components/common/SectionHeader";
import MoverCard from "@/components/searchMover/MoverCard";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverInfo } from "@/types/mover.types";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { toast } from "react-toastify";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

const FavoriteMoverPage = () => {
  const t = useTranslations("favoriteMover");
  const [favoriteMovers, setFavoriteMovers] = useState<IMoverInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [selectedMovers, setSelectedMovers] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 찜한 기사님 목록 가져오기
  useEffect(() => {
    const fetchFavoriteMovers = async () => {
      try {
        setLoading(true);
        const movers = await findMoverApi.fetchFavoriteMovers();
        setFavoriteMovers(movers);
      } catch (error) {
        console.error("찜한 기사님 목록 조회 실패:", error);
        setFavoriteMovers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteMovers();
  }, []);

  // 전체 선택/해제 핸들러
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedMovers(new Set());
      setSelectAll(false);
    } else {
      setSelectedMovers(new Set(favoriteMovers.map((mover) => mover.id.toString())));
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
    setSelectAll(newSelected.size === favoriteMovers.length);
  };

  // 선택된 항목 삭제 핸들러
  const handleDeleteSelected = async () => {
    if (selectedMovers.size === 0) return;

    try {
      setDeleting(true);

      // 선택된 기사님들의 찜하기 제거
      const deletePromises = Array.from(selectedMovers).map((moverId) => findMoverApi.removeFavorite(moverId));
      await Promise.all(deletePromises);

      // 목록에서 제거
      setFavoriteMovers((prev) => prev.filter((mover) => !selectedMovers.has(mover.id.toString())));
      setSelectedMovers(new Set());
      setSelectAll(false);

      // 성공 토스트 표시
      toast.success(`${selectedMovers.size}${t("deleteSuccess")}`);
    } catch (error) {
      console.error("선택된 항목 삭제 실패:", error);
      // 에러 토스트 표시
      toast.error(t("deleteError"));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex min-w-[375px] flex-col">
      <SectionHeader>
        <div className="flex h-full w-full items-center justify-between px-[30px] md:px-18 lg:px-90">
          <h1 className="text-2lg leading-2lg text-black-500 font-semibold">{t("title")}</h1>
        </div>
      </SectionHeader>
      <section className="min-h-screen bg-gray-100 pt-[22px]">
        <div className="mb-[10px] flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <button
              className={`h-5 w-5 rounded-[4px] border border-gray-200 ${selectAll ? "bg-primary-400" : "bg-gray-50"}`}
              onClick={handleSelectAll}
            />
            <span className="text-md text-black-300 leading-6 font-normal md:text-base">
              {t("selectAll")}({selectedMovers.size}/{favoriteMovers.length})
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

        {loading ? (
          <div className="min-h-screen bg-gray-200">
            <MovingTruckLoader size="lg" loadingText={t("estimateRequest.loadingText")} />
          </div>
        ) : favoriteMovers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="mb-2 text-lg font-medium">{t("noFavorites")}</p>
            <p className="text-sm">{t("noFavoritesDesc")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            {favoriteMovers.map((mover) => (
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
          </div>
        )}
      </section>
    </div>
  );
};

export default FavoriteMoverPage;
