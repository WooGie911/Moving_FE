"use client";
import React, { useState, useMemo } from "react";
import { FilterAndSearchSection } from "@/components/estimate/received/FilterAndSearchSection";
import { IFilterState, mockEstimateRequestResponseData } from "@/types/moverEstimate";
import { CardList } from "@/components/estimate/CardList";
import { useQuery } from "@tanstack/react-query";
import moverEstimateApi from "@/lib/api/moverEstimate.api";

export const MoverReceivedPage = () => {
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["receivedEstimateRequest"],
    queryFn: () =>
      moverEstimateApi.getAllEstimateRequests({
        region: true,
        designated: true,
      }),
  });
  console.log("받은 요청 데이터", data);
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
    let filtered: any[] = [];

    // 지정 견적과 서비스 가능 지역 필터링에 따라 데이터 선택
    if (filters.isDesignatedOnly && filters.isServiceAreaOnly) {
      // 둘 다 선택된 경우: 두 배열 모두 포함
      const designatedWithFlag = (data?.designatedEstimateRequests || []).map((item) => ({
        ...item,
        isDesignated: true,
      }));
      const regionWithFlag = (data?.regionEstimateRequests || []).map((item) => ({ ...item, isDesignated: false }));
      filtered = [...designatedWithFlag, ...regionWithFlag];
    } else if (filters.isDesignatedOnly) {
      // 지정 견적만 선택된 경우
      filtered = (data?.designatedEstimateRequests || []).map((item) => ({ ...item, isDesignated: true }));
    } else if (filters.isServiceAreaOnly) {
      // 서비스 가능 지역만 선택된 경우
      filtered = (data?.regionEstimateRequests || []).map((item) => ({ ...item, isDesignated: false }));
    } else {
      // 둘 다 선택되지 않은 경우: 기본적으로 모든 데이터 표시
      const designatedWithFlag = (data?.designatedEstimateRequests || []).map((item) => ({
        ...item,
        isDesignated: true,
      }));
      const regionWithFlag = (data?.regionEstimateRequests || []).map((item) => ({ ...item, isDesignated: false }));
      filtered = [...designatedWithFlag, ...regionWithFlag];
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
    return <div>로딩 중...</div>;
  }

  // 에러 상태
  if (isError) {
    console.error("API 에러:", error);
    return <div>에러가 발생했습니다. 다시 시도해주세요.</div>;
  }

  // 데이터가 없는 경우
  if (!data || (!data.regionEstimateRequests?.length && !data.designatedEstimateRequests?.length)) {
    return (
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center px-6 md:px-18 lg:px-0">
        <div className="flex w-full justify-start">
          <div className="text-2lg text-black-500 cursor-pointer py-4 font-bold whitespace-nowrap transition-colors">
            받은요청
          </div>
        </div>
        <div className="flex h-full w-full flex-col items-center justify-center bg-[#fafafa]">
          <div className="flex min-h-[650px] flex-col items-center justify-center md:min-h-[900px]">
            <div className="text-center">
              <p className="mb-2 text-lg font-medium text-gray-600">기사님의 서비스 가능 지역 내 수락 가능한 견적</p>
              <p className="mb-2 text-lg font-medium text-gray-600">
                혹은 기사님께 도착한 지정견적이 존재하지 않습니다.
              </p>
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
            <CardList key={item.id} id={item.id} data={item} isDesignated={item.isDesignated} type="received" />
          ))}
        </div>
      </div>
    </div>
  );
};
