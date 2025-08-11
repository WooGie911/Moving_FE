"use client";
import { SearchInput } from "@/components/common/input/SearchInput";
import { FormProvider, useForm } from "react-hook-form";
import React, { useEffect } from "react";
import { SmallFilterSection } from "./SmallFilterSection";
import { PcFillterSection } from "./PcFillterSection";
import { IFilterState } from "@/types/moverEstimate";
import { useTranslations } from "next-intl";

// 필터 상태 타입

interface FilterAndSearchSectionProps {
  filters: IFilterState;
  onFiltersChange: (newFilters: Partial<IFilterState>) => void;
  totalCount: number;
}

export const FilterAndSearchSection = ({ filters, onFiltersChange, totalCount }: FilterAndSearchSectionProps) => {
  const t = useTranslations("estimate");
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
    <section
      className="mt-[10px] flex w-full flex-col gap-4 md:gap-7 lg:gap-6"
      aria-label={t("ariaLabels.searchSection")}
      role="search"
    >
      {/* 검색 영역 */}
      <div className="flex w-full flex-col gap-4 md:gap-7 lg:gap-6" aria-label={t("ariaLabels.searchInput")}>
        <FormProvider {...methods}>
          <SearchInput
            name="search"
            inputClassName="w-full bg-bg-secondary"
            wrapperClassName="w-full"
            placeholder={t("searchPlaceholder")}
            aria-label={t("ariaLabels.searchInput")}
          />
        </FormProvider>
      </div>

      {/* 필터 영역 */}
      <div
        className="flex w-full flex-col gap-4 md:gap-7 lg:gap-6"
        aria-label={t("ariaLabels.filterSection")}
        role="group"
        aria-describedby="total-count"
      >
        {/* 총 개수 표시 */}
        <div id="total-count" className="sr-only" aria-live="polite">
          {t("ariaLabels.totalCount")}: {totalCount}
        </div>

        {/* 모바일 필터 */}
        <div className="lg:hidden" aria-label={t("ariaLabels.mobileFilter")}>
          <SmallFilterSection filters={filters} onFiltersChange={onFiltersChange} totalCount={totalCount} />
        </div>

        {/* 데스크톱 필터 */}
        <div className="hidden w-full lg:block" aria-label={t("ariaLabels.desktopFilter")}>
          <PcFillterSection filters={filters} onFiltersChange={onFiltersChange} totalCount={totalCount} />
        </div>
      </div>
    </section>
  );
};
