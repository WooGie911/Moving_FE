"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useFavoriteMovers } from "@/hooks/useMoverData";
import MoverCard from "./MoverCard";

const FavoriteMoverList = () => {
  const t = useTranslations("mover");
  const { data: movers = [], isError } = useFavoriteMovers();
  const [topValue, setTopValue] = useState(376);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;

      // 스크롤 위치에 따라 top 값 동적으로 계산하는 방식으로 변경
      let newTopValue;

      if (scrollY < 100) {
        newTopValue = 376;
      } else {
        newTopValue = scrollY + 50;
      }

      setTopValue(newTopValue);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isError) {
    return (
      <aside
        className={`sticky ml-[54px] flex h-fit flex-col`}
        style={{ top: `${topValue}px` }}
        role="complementary"
        aria-live="polite"
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-900" role="heading" aria-level={2}>
          {t("favoriteMoversTitle")}
        </h2>
        <div className="text-red-500" role="alert" aria-live="assertive">
          찜한 기사님 목록을 불러오는데 실패했습니다.
        </div>
      </aside>
    );
  }

  if (!movers || movers.length === 0) return null;

  return (
    <aside
      className={`sticky ml-[54px] flex h-fit flex-col`}
      style={{ top: `${topValue}px` }}
      role="complementary"
      aria-labelledby="favorite-list-title"
    >
      <h2 id="favorite-list-title" className="mb-4 text-xl font-semibold text-gray-900" role="heading" aria-level={2}>
        {t("favoriteMoversTitle")}
      </h2>
      <ul className="space-y-4" role="list" aria-label={`찜한 기사님 ${movers.length}명`}>
        {movers.map((mover) => (
          <li key={mover.id} role="listitem">
            <MoverCard mover={mover} variant="favorite" />
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default FavoriteMoverList;
