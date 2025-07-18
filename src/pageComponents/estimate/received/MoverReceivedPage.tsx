"use client";
import React, { useState, useMemo } from "react";
import { FilterAndSearchSection } from "@/components/estimate/received/FilterAndSearchSection";
import { IFilterState, mockQuoteResponseData } from "@/types/moverEstimate";
import { CardList } from "@/components/estimate/CardList";

export const MoverReceivedPage = () => {
  // 필터 상태 관리
  const [filters, setFilters] = useState<IFilterState>({
    movingTypes: [],
    isDesignatedOnly: false,
    isServiceAreaOnly: false,
    searchKeyword: "",
    sortBy: "createdAt",
  });

  // 필터링된 데이터
  const filteredData = useMemo(() => {
    let filtered = [...mockQuoteResponseData];

    // 검색어 필터링
    if (filters.searchKeyword) {
      filtered = filtered.filter(
        (item) =>
          item.user.name.includes(filters.searchKeyword) ||
          item.departureAddr.includes(filters.searchKeyword) ||
          item.arrivalAddr.includes(filters.searchKeyword),
      );
    }

    // 이사 유형 필터링
    if (filters.movingTypes.length > 0) {
      filtered = filtered.filter((item) => filters.movingTypes.includes(item.movingType));
    }

    // 지정 견적 요청 필터링
    if (filters.isDesignatedOnly) {
      // 실제로는 isDesignated 정보가 필요하지만, 목데이터에서는 모든 항목이 지정견적으로 설정
      filtered = filtered.filter((item) => true); // 모든 항목이 지정견적으로 가정
    }

    // 서비스 가능 지역 필터링
    if (filters.isServiceAreaOnly) {
      // 실제로는 서비스 가능 지역 정보가 필요하지만, 목데이터에서는 모든 지역으로 가정
      filtered = filtered.filter((item) => true);
    }

    // 정렬
    filtered.sort((a, b) => {
      if (filters.sortBy === "movingDate") {
        return new Date(a.movingDate).getTime() - new Date(b.movingDate).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [filters]);

  // 필터 업데이트 함수
  const updateFilters = (newFilters: Partial<IFilterState>) => {
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      return updated;
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center px-6 md:px-18 lg:px-0">
      {/* 최상단 탭 */}
      <div className="flex w-full justify-start">
        <div className="text-2lg text-black-500 cursor-pointer py-4 font-bold whitespace-nowrap transition-colors">
          받은요청
        </div>
      </div>
      {/* 상단 인풋 영역 */}
      <FilterAndSearchSection filters={filters} onFiltersChange={updateFilters} totalCount={filteredData.length} />
      {/* 하단 견적 목록들 */}
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
          {filteredData.map((item) => (
            <CardList key={item.id} id={item.id} data={item} isDesignated={false} isConfirmed={false} type="received" />
          ))}
        </div>
      </div>
    </div>
  );
};
