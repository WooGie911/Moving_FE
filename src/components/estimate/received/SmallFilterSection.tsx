"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import sort_active from "@/assets/icon/filter/icon-filter-active.svg";
import sort_inactive from "@/assets/icon/filter/icon-filter-inactive.svg";
import { useModal, useModalStore } from "@/components/common/modal/ModalContext";
import { SelectCheckBox } from "./SelectCheckBox";
import { SelectMovingType } from "./SelectMovingType";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { Dropdown } from "./Dropdown";
import { IFilterState } from "@/types/moverEstimate";
import { useTranslations } from "next-intl";

interface SmallFilterSectionProps {
  filters: IFilterState;
  onFiltersChange: (newFilters: Partial<IFilterState>) => void;
  totalCount: number;
}

export const SmallFilterSection = ({ filters, onFiltersChange, totalCount }: SmallFilterSectionProps) => {
  const { open, close } = useModal();
  const modal = useModalStore((state) => state.modal);
  const deviceType = useWindowWidth();
  const isModalOpening = useRef(false);
  const currentModalFilters = useRef<IFilterState>(filters);
  const t = useTranslations("moverEstimate");

  // 모달 내부 상태 관리 (실시간 반영을 위해)
  const [modalFilters, setModalFilters] = useState<IFilterState>(filters);

  // 화면이 desktop(lg)이상이면 모달 자동 close (필터 모달인 경우에만)
  React.useEffect(() => {
    if (modal && deviceType === "desktop" && modal.title === t("filter")) {
      close();
    }
  }, [deviceType, modal, close]);

  // 모달이 열릴 때마다 현재 부모의 필터 상태로 초기화 (처음 열릴 때만)
  useEffect(() => {
    if (modal && isModalOpening.current) {
      const newModalFilters = {
        movingTypes: [...filters.movingTypes],
        isDesignatedOnly: filters.isDesignatedOnly,
        isServiceAreaOnly: filters.isServiceAreaOnly,
        searchKeyword: filters.searchKeyword,
        sortBy: filters.sortBy,
      };
      setModalFilters(newModalFilters);
      currentModalFilters.current = newModalFilters;
      isModalOpening.current = false; // 초기화 완료 후 플래그 리셋
    }
  }, [modal, filters]);

  // 이사 유형 변경 핸들러 (모달 내부용)
  const handleModalTypeChange = (type: string) => {
    const newTypes = currentModalFilters.current.movingTypes.includes(type)
      ? currentModalFilters.current.movingTypes.filter((t) => t !== type)
      : [...currentModalFilters.current.movingTypes, type];
    const updatedFilters = { ...currentModalFilters.current, movingTypes: newTypes };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  // 체크박스 변경 핸들러 (모달 내부용)
  const handleModalDesignatedChange = (checked: boolean) => {
    const updatedFilters = { ...currentModalFilters.current, isDesignatedOnly: checked };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  const handleModalServiceAreaChange = (checked: boolean) => {
    const updatedFilters = { ...currentModalFilters.current, isServiceAreaOnly: checked };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  // 조회하기 버튼 클릭 시 실제 필터 적용
  const handleApplyFilters = () => {
    // 현재 모달 상태를 부모 컴포넌트에 즉시 적용
    onFiltersChange({
      movingTypes: [...currentModalFilters.current.movingTypes],
      isDesignatedOnly: currentModalFilters.current.isDesignatedOnly,
      isServiceAreaOnly: currentModalFilters.current.isServiceAreaOnly,
      searchKeyword: filters.searchKeyword, // 검색어는 유지
      sortBy: filters.sortBy, // 정렬은 유지
    });
    close();
  };

  // 체크박스 변경 핸들러 (PC용)
  const handleDesignatedChange = (checked: boolean) => {
    onFiltersChange({ isDesignatedOnly: checked });
  };

  const handleServiceAreaChange = (checked: boolean) => {
    onFiltersChange({ isServiceAreaOnly: checked });
  };

  // 필터가 활성화되어 있는지 확인하는 함수
  const isFilterActive = () => {
    return filters.movingTypes.length > 0 || filters.isDesignatedOnly || filters.isServiceAreaOnly;
  };

  // 활성화된 필터 수 계산
  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.movingTypes.length > 0) count += 1;
    if (filters.isDesignatedOnly) count += 1;
    if (filters.isServiceAreaOnly) count += 1;
    return count;
  };

  return (
    <section className="flex w-full flex-row justify-between" aria-label={t("ariaLabels.filterSection")} role="region">
      <p className="text-sm text-gray-600" aria-label={t("ariaLabels.totalCount")}>
        {`${t("totalCount")} ${totalCount}${t("countUnit")}`}
      </p>

      <div
        className="flex flex-row items-center justify-center gap-1"
        role="group"
        aria-label={t("ariaLabels.filterSection")}
      >
        {/* 정렬 드롭다운 */}
        <Dropdown
          value={filters.sortBy}
          onChange={(sortBy) => onFiltersChange({ sortBy })}
          aria-label={t("ariaLabels.sortDropdown")}
        />

        {/* 필터 버튼 */}
        <button
          className="flex h-[32px] w-[32px] items-center justify-center rounded-md transition-colors hover:bg-gray-100 focus:outline-none"
          onClick={() => {
            isModalOpening.current = true;
            open({
              title: t("filter"),
              children: (
                <div
                  className="flex flex-col items-start justify-center gap-4"
                  role="dialog"
                  aria-label={t("ariaLabels.filterModal")}
                  aria-modal="true"
                >
                  {/* 이사유형 라벨 선택 영역 */}
                  <section
                    className="flex flex-col items-start justify-center gap-2 pb-7"
                    aria-label={t("ariaLabels.movingTypeSection")}
                    role="group"
                  >
                    <h3 className="text-black-500 text-[16px] leading-[26px] font-semibold">{t("movingType")}</h3>
                    <SelectMovingType selectedTypes={modalFilters.movingTypes} onTypeChange={handleModalTypeChange} />
                  </section>

                  <section
                    className="flex flex-col items-start justify-center gap-2"
                    aria-label={t("ariaLabels.regionSection")}
                    role="group"
                  >
                    <h3 className="text-black-500 text-[16px] leading-[26px] font-semibold">
                      {t("regionAndEstimate")}
                    </h3>
                    <SelectCheckBox
                      isDesignatedOnly={modalFilters.isDesignatedOnly}
                      isServiceAreaOnly={modalFilters.isServiceAreaOnly}
                      onDesignatedChange={handleModalDesignatedChange}
                      onServiceAreaChange={handleModalServiceAreaChange}
                    />
                  </section>
                </div>
              ),
              type: "bottomSheet", // "center" | "bottomSheet" (생략 시 기본값: "center")
              buttons: [
                {
                  text: t("search"),
                  onClick: () => {
                    handleApplyFilters();
                  },
                  disabled: false, // 선택사항
                },
                // ...필요시 여러 버튼 추가 가능
              ],
            });
          }}
          aria-label={isFilterActive() ? t("ariaLabels.filterButtonActive") : t("ariaLabels.filterButton")}
          aria-pressed={isFilterActive()}
          aria-describedby={isFilterActive() ? "filter-count" : undefined}
        >
          <Image
            src={isFilterActive() ? sort_active : sort_inactive}
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
          />
          {isFilterActive() && (
            <span id="filter-count" className="sr-only" aria-label={t("ariaLabels.filterCount")}>
              {getActiveFilterCount()}
            </span>
          )}
        </button>
      </div>
    </section>
  );
};
