"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFavoriteMovers } from "@/hooks/useMoverData";
import MoverCard from "./MoverCard";

const FavoriteMoverList = () => {
  const t = useTranslations("mover");
  const { data: movers = [], isLoading, isError } = useFavoriteMovers();
  const [topValue, setTopValue] = useState(376);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      if (scrollY < 100) {
        setTopValue(376); 
      } else {
        setTopValue(150); 
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className={`sticky ml-[54px] flex h-fit flex-col`} style={{ top: `${topValue}px` }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("favoriteMoversTitle")}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[200px] w-[327px] animate-pulse rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`sticky ml-[54px] flex h-fit flex-col`} style={{ top: `${topValue}px` }}>
        <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("favoriteMoversTitle")}</h2>
        <div className="text-red-500">찜한 기사님 목록을 불러오는데 실패했습니다.</div>
      </div>
    );
  }

  if (!movers || movers.length === 0) return null;

  return (
    <div className={`sticky ml-[54px] flex h-fit flex-col`} style={{ top: `${topValue}px` }}>
      <h2 className="mb-4 text-xl font-semibold text-gray-900">{t("favoriteMoversTitle")}</h2>
      <div className="space-y-4">
        {movers.map((mover) => (
          <MoverCard key={mover.id} mover={mover} variant="favorite" />
        ))}
      </div>
    </div>
  );
};

export default FavoriteMoverList;
