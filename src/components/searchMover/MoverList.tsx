"use client";

import React, { useMemo } from "react";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import { useMoverList } from "@/hooks/useMoverData";
import MoverCard from "./MoverCard";

const MoverList = () => {
  const { region, serviceTypeId, search, sort } = useSearchMoverStore();
  const t = useTranslations("mover");

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "100px",
  });

  // 쿼리 파라미터 메모이제이션
  const queryParams = useMemo(
    () => ({
      region,
      serviceTypeId,
      search,
      sort,
      take: 2,
    }),
    [region, serviceTypeId, search, sort],
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, error } = useMoverList(queryParams);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 lg:w-205">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">{t("loadingMessage")}</div>
        </div>
      </div>
    );
  }

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
      <div className="flex flex-col items-center justify-center py-12 lg:w-205">
        <div className="mb-2 text-lg text-gray-500">{t("noSearchResult")}</div>
        <div className="text-sm text-gray-400">{t("tryOtherSearch")}</div>
      </div>
    );
  }

  return (
    <div className="mb-10 space-y-6 lg:space-y-5">
      {allMovers.map((mover) => (
        <MoverCard key={mover.id} mover={mover} variant="list" />
      ))}

      {/* 무한스크롤 감지용 div */}
      <div ref={ref} style={{ height: 1 }} />

      {isFetchingNextPage && <div className="py-4 text-center text-gray-500">{t("loadingMessage")}</div>}
    </div>
  );
};

export default MoverList;
