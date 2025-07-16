"use client";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import sort_active from "@/assets/icon/filter/icon-filter-active.png";
import sort_inactive from "@/assets/icon/filter/icon-filter-inactive.png";
import { useModal, useModalStore } from "@/components/common/modal/ModalContext";
import { SelectCheckBox } from "./SelectCheckBox";
import { SelectMovinType } from "./SelectMovinType";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { Dropdown } from "./Dropdown";
import { IFilterState } from "@/types/moverEstimate";

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

  // 모달 내부 상태 관리 (실시간 반영을 위해)
  const [modalFilters, setModalFilters] = useState<IFilterState>(filters);

  // 화면이 desktop(lg)이상이면 모달 자동 close
  React.useEffect(() => {
    if (modal && deviceType === "desktop") {
      close();
    }
  }, [deviceType, modal, close]);

  // 모달이 열릴 때마다 현재 부모의 필터 상태로 초기화
  useEffect(() => {
    if (modal) {
      console.log("Modal opened, syncing filters:", filters);
      console.log("Current modalFilters before sync:", modalFilters);
      const newModalFilters = {
        movingTypes: [...filters.movingTypes],
        isDesignatedOnly: filters.isDesignatedOnly,
        isServiceAreaOnly: filters.isServiceAreaOnly,
        searchKeyword: filters.searchKeyword,
        sortBy: filters.sortBy,
      };
      console.log("Setting modal filters to:", newModalFilters);
      setModalFilters(newModalFilters);
      currentModalFilters.current = newModalFilters;
    }
  }, [modal, filters]);

  // 이사 유형 변경 핸들러 (모달 내부용)
  const handleModalTypeChange = (type: string) => {
    console.log("Modal type change:", type, "current:", modalFilters.movingTypes);
    const newTypes = modalFilters.movingTypes.includes(type)
      ? modalFilters.movingTypes.filter((t) => t !== type)
      : [...modalFilters.movingTypes, type];
    console.log("New types:", newTypes);
    const updatedFilters = { ...modalFilters, movingTypes: newTypes };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  // 체크박스 변경 핸들러 (모달 내부용)
  const handleModalDesignatedChange = (checked: boolean) => {
    console.log("Modal designated change:", checked);
    const updatedFilters = { ...modalFilters, isDesignatedOnly: checked };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  const handleModalServiceAreaChange = (checked: boolean) => {
    console.log("Modal service area change:", checked);
    const updatedFilters = { ...modalFilters, isServiceAreaOnly: checked };
    setModalFilters(updatedFilters);
    currentModalFilters.current = updatedFilters;
  };

  // 조회하기 버튼 클릭 시 실제 필터 적용
  const handleApplyFilters = () => {
    console.log("Applying filters:", currentModalFilters.current);
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

  return (
    <div className="flex w-full flex-row justify-between">
      <p>{`전체 ${totalCount}건`}</p>
      <div className="flex flex-row items-center justify-center gap-1">
        {/* 정렬 버튼 */}
        <Dropdown value={filters.sortBy} onChange={(sortBy) => onFiltersChange({ sortBy })} />

        <button
          className="relative h-[32px] w-[32px]"
          onClick={() => {
            console.log("Opening modal with current filters:", filters);
            isModalOpening.current = true;
            open({
              title: "필터",
              children: (
                <div className="flex flex-col items-start justify-center gap-4">
                  {/* 이사유형 라벨 선택 영역 */}
                  <div className="flex flex-col items-start justify-center gap-2 pb-7">
                    <p className="text-black-500 text-[16px] leading-[26px] font-semibold">이사 유형</p>
                    <SelectMovinType selectedTypes={modalFilters.movingTypes} onTypeChange={handleModalTypeChange} />
                  </div>
                  <div className="flex flex-col items-start justify-center gap-2">
                    <p className="text-black-500 text-[16px] leading-[26px] font-semibold">지역 및 견적 </p>
                    <SelectCheckBox
                      isDesignatedOnly={modalFilters.isDesignatedOnly}
                      isServiceAreaOnly={modalFilters.isServiceAreaOnly}
                      onDesignatedChange={handleModalDesignatedChange}
                      onServiceAreaChange={handleModalServiceAreaChange}
                    />
                  </div>
                </div>
              ),
              type: "bottomSheet", // "center" | "bottomSheet" (생략 시 기본값: "center")
              buttons: [
                {
                  text: "조회하기",
                  onClick: () => {
                    console.log("조회하기 버튼 클릭됨!");
                    handleApplyFilters();
                  },
                  disabled: false, // 선택사항
                },
                // ...필요시 여러 버튼 추가 가능
              ],
            });
          }}
        >
          <Image src={modal ? sort_active : sort_inactive} alt="sortModal" fill className="object-contain" />
        </button>
      </div>
    </div>
  );
};
