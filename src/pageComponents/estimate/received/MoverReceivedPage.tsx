"use client";
import React, { useState, useMemo } from "react";
import { FilterAndSearchSection } from "@/components/estimate/received/FilterAndSearchSection";
import { IFilterState } from "@/types/moverEstimate";
import { CardList } from "@/components/estimate/CardList";
import { useQuery } from "@tanstack/react-query";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import { useTranslations, useLocale } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export const MoverReceivedPage = () => {
  const t = useTranslations("estimate");
  const commonT = useTranslations("common");
  const locale = useLocale();

  // 필터 상태 관리
  const [filters, setFilters] = useState<IFilterState>({
    movingTypes: [],
    isDesignatedOnly: false,
    isServiceAreaOnly: false,
    searchKeyword: "",
    sortBy: "createdAt",
  });

  const { data, isPending, isError, error } = useQuery({
    queryKey: ["receivedEstimateRequests", locale, filters],
    queryFn: () =>
      moverEstimateApi.getAllEstimateRequests(
        {
          region: true,
          designated: true,
        },
        locale,
      ),
  });

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let filtered: any[] = [];

    // 지정 견적과 서비스 가능 지역 필터링에 따라 데이터 선택
    if (filters.isDesignatedOnly && filters.isServiceAreaOnly) {
      // 둘 다 선택된 경우: 두 배열 모두 포함하되 중복 제거
      const designatedWithFlag = (data?.designatedEstimateRequests || []).map((item) => ({
        ...item,
        isDesignated: true,
      }));
      const regionWithFlag = data?.regionEstimateRequests || [];

      // 중복 제거: designatedEstimateRequests를 우선으로 하고, 중복되지 않은 regionEstimateRequests만 추가
      const designatedIds = new Set(designatedWithFlag.map((item) => item.id));
      const uniqueRegionItems = regionWithFlag.filter((item) => !designatedIds.has(item.id));

      filtered = [...designatedWithFlag, ...uniqueRegionItems];
    } else if (filters.isDesignatedOnly) {
      // 지정 견적만 선택된 경우
      filtered = (data?.designatedEstimateRequests || []).map((item) => ({ ...item, isDesignated: true }));
    } else if (filters.isServiceAreaOnly) {
      // 서비스 가능 지역만 선택된 경우
      filtered = data?.regionEstimateRequests || [];
    } else {
      // 둘 다 선택되지 않은 경우: 기본적으로 모든 데이터 표시하되 중복 제거
      const designatedWithFlag = (data?.designatedEstimateRequests || []).map((item) => ({
        ...item,
        isDesignated: true,
      }));
      const regionWithFlag = data?.regionEstimateRequests || [];

      // 중복 제거: designatedEstimateRequests를 우선으로 하고, 중복되지 않은 regionEstimateRequests만 추가
      const designatedIds = new Set(designatedWithFlag.map((item) => item.id));
      const uniqueRegionItems = regionWithFlag.filter((item) => !designatedIds.has(item.id));

      filtered = [...designatedWithFlag, ...uniqueRegionItems];
    }

    // 검색어 필터링
    if (filters.searchKeyword) {
      filtered = filtered.filter(
        (item) =>
          item.customer.name.includes(filters.searchKeyword) ||
          item.fromAddress.region.includes(filters.searchKeyword) ||
          item.toAddress.region.includes(filters.searchKeyword),
      );
    }

    // 이사 유형 필터링
    if (filters.movingTypes.length > 0) {
      filtered = filtered.filter((item) => filters.movingTypes.includes(item.moveType));
    }

    // 정렬
    filtered.sort((a, b) => {
      if (filters.sortBy === "moveDate") {
        // 이사빠른순: 이사일이 빠른 순서대로 정렬 (오름차순)
        const dateA = new Date(a.moveDate).getTime();
        const dateB = new Date(b.moveDate).getTime();
        return dateA - dateB;
      } else {
        // 최신순: 생성일이 최신인 순서대로 정렬 (내림차순)
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return dateB - dateA;
      }
    });

    return filtered;
  }, [filters, data]);

  // 필터 업데이트 함수
  const updateFilters = (newFilters: Partial<IFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
  };

  // 로딩 상태
  if (isPending) {
    return (
      <div>
        <MovingTruckLoader size="lg" loadingText={commonT("loading")} />
      </div>
    );
  }

  // 에러 상태
  if (isError) {
    console.error(`${t("apiError")}`, error);
    return <div>{commonT("error")}</div>;
  }
  // 데이터가 없는 경우
  if (!data || (!data.regionEstimateRequests?.length && !data.designatedEstimateRequests?.length)) {
    return (
      <div className="mx-auto flex h-full w-full max-w-[1200px] flex-col items-center justify-center px-6 md:px-18 lg:px-0">
        <div className="flex w-full justify-start">
          <div className="text-2lg text-black-500 cursor-pointer py-4 font-bold whitespace-nowrap transition-colors">
            {t("receivedRequests")}
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">{t("noAvailableEstimatesMessage1")}</p>
              <p className="mb-2 text-lg font-medium text-gray-600">{t("noAvailableEstimatesMessage2")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center px-6 md:px-18 lg:px-0">
      {/* 최상단 탭 */}
      <div className="flex w-full justify-start">
        <div className="text-black-500 h-[96px] cursor-pointer py-8 text-[24px] font-bold whitespace-nowrap transition-colors">
          {t("receivedRequests")}
        </div>
      </div>
      {/* 상단 인풋 영역 */}
      <FilterAndSearchSection filters={filters} onFiltersChange={updateFilters} totalCount={filteredData.length} />
      {/* 하단 견적 목록들 */}
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
          {filteredData.map((item) => (
            <CardList key={item.id} id={item.id} data={item} isDesignated={item.isDesignated} usedAt="received" />
          ))}
        </div>
      </div>
    </div>
  );
};
