import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { SelectMovingType } from "./SelectMovingType";
import { SelectCheckBox } from "./SelectCheckBox";
import { Dropdown } from "./Dropdown";
import { IFilterState } from "@/types/moverEstimate";
import { useTranslations } from "next-intl";

interface IPcFillterSectionProps {
  filters: IFilterState;
  onFiltersChange: (newFilters: Partial<IFilterState>) => void;
  totalCount: number;
}

export const PcFillterSection = ({ filters, onFiltersChange, totalCount }: IPcFillterSectionProps) => {
  const t = useTranslations("moverEstimate");

  // 이사 유형 변경 핸들러
  const handleTypeChange = (type: string) => {
    const newTypes = filters.movingTypes.includes(type)
      ? filters.movingTypes.filter((t) => t !== type)
      : [...filters.movingTypes, type];
    onFiltersChange({ movingTypes: newTypes });
  };

  // 체크박스 변경 핸들러
  const handleDesignatedChange = (checked: boolean) => {
    onFiltersChange({ isDesignatedOnly: checked });
  };

  const handleServiceAreaChange = (checked: boolean) => {
    onFiltersChange({ isServiceAreaOnly: checked });
  };

  // 정렬 변경 핸들러
  const handleSortChange = (sortBy: "moveDate" | "createdAt") => {
    onFiltersChange({ sortBy });
  };

  return (
    <section
      className="flex w-full flex-col items-start justify-center gap-10"
      aria-label={t("ariaLabels.pcFilterSection")}
      role="region"
    >
      {/* 이사유형 선택 라벨*/}
      <SelectMovingType selectedTypes={filters.movingTypes} onTypeChange={handleTypeChange} />

      <section
        className="flex w-full flex-row items-center justify-start pt-6"
        aria-label={t("ariaLabels.totalCountSection")}
        role="group"
      >
        <p
          className="text-black-500 text-[18px] leading-[26px] font-semibold"
          aria-label={`${t("ariaLabels.totalCount")} ${totalCount}${t("countUnit")}`}
        >
          {`${t("totalCount")} ${totalCount}${t("countUnit")}`}
        </p>
      </section>

      <section
        className="flex w-full flex-row items-center justify-between"
        aria-label={t("ariaLabels.filterOptionsSection")}
        role="group"
      >
        <SelectCheckBox
          isDesignatedOnly={filters.isDesignatedOnly}
          isServiceAreaOnly={filters.isServiceAreaOnly}
          onDesignatedChange={handleDesignatedChange}
          onServiceAreaChange={handleServiceAreaChange}
        />
        <Dropdown value={filters.sortBy} onChange={handleSortChange} />
      </section>
    </section>
  );
};
