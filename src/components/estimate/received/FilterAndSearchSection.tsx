"use client";
import { SearchInput } from "@/components/common/input/SearchInput";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { SmallFilterSection } from "./SmallFilterSection";
import { PcFillterSection } from "./PcFillterSection";
import { IFilterState } from "@/types/moverEstimate";

// 필터 상태 타입

interface FilterAndSearchSectionProps {
  filters: IFilterState;
  onFiltersChange: (newFilters: Partial<IFilterState>) => void;
  totalCount: number;
}

export const FilterAndSearchSection = ({ filters, onFiltersChange, totalCount }: FilterAndSearchSectionProps) => {
  const methods = useForm({
    defaultValues: {
      search: filters.searchKeyword,
    },
  });

  // 검색어 변경 감지
  useEffect(() => {
    const subscription = methods.watch((value, { name }) => {
      if (name === "search") {
        onFiltersChange({ searchKeyword: value.search || "" });
      }
    });
    return () => subscription.unsubscribe();
  }, [methods, onFiltersChange]);

  return (
    <>
      {/* 하단 인풋 영역 */}
      <div className="flex w-full flex-col gap-4 md:gap-7 lg:gap-6">
        <FormProvider {...methods}>
          <SearchInput name="search" placeholder="어떤 고객님을 찾고 계세요?" />
        </FormProvider>
        <div className="lg:hidden">
          <SmallFilterSection filters={filters} onFiltersChange={onFiltersChange} totalCount={totalCount} />
        </div>
        <div className="hidden w-full lg:block">
          <PcFillterSection filters={filters} onFiltersChange={onFiltersChange} totalCount={totalCount} />
        </div>
      </div>
    </>
  );
};
