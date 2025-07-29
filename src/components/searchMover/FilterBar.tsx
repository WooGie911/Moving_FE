"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import CustomDropdown from "@/components/common/dropdown/CustomDropdown";
import { getRegionTranslation, getServiceTypeTranslation } from "@/lib/utils/translationUtils";
import { useRegions, useServiceTypes } from "@/hooks/useMoverData";
import SortBar from "@/components/searchMover/SortBar";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { Option } from "@/types/dropdown";

const FilterBar = () => {
  const { region, setRegion, serviceTypeId, setServiceTypeId, reset } = useSearchMoverStore();
  const deviceType = useWindowWidth();
  const t = useTranslations("mover");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);

  // React Query로 데이터 가져오기
  const { data: regions = [], isLoading: regionsLoading } = useRegions();
  const { data: serviceTypes = [], isLoading: serviceTypesLoading } = useServiceTypes();

  // 옵션 생성 (메모이제이션)
  const regionOptions: Option[] = React.useMemo(
    () => [
      { value: "", label: t("all") },
      ...regions.map((region) => ({ value: region, label: getRegionTranslation(region, t) })),
    ],
    [regions, t],
  );

  const serviceOptions: Option[] = React.useMemo(
    () => [
      { value: "", label: t("all") },
      ...serviceTypes.map((service) => ({ value: service.id, label: getServiceTypeTranslation(service.name, t) })),
    ],
    [serviceTypes, t],
  );

  const isLoading = regionsLoading || serviceTypesLoading;

  // 스켈레톤 로딩
  if (isLoading) {
    return (
      <div className="mb-7 flex w-[327px] items-center justify-between md:mb-10 md:w-[600px] lg:mb-[37px] lg:w-full">
        <div className="flex w-full items-center">
          <div className="h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
          <div className="ml-3 h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
          <div className="ml-[25px] h-[32px] w-[48px] animate-pulse rounded bg-gray-200" />
        </div>
        <div className="h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="mb-7 flex w-[327px] items-center justify-between md:mb-10 md:w-[600px] lg:mb-[37px] lg:w-full">
      <div className="flex w-full items-center">
        {/* 지역 필터 */}
        <CustomDropdown
          options={regionOptions}
          value={region}
          onChange={(value) => setRegion(value as string)}
          placeholder={t("region")}
          twoColumns={true}
          onOpenChange={setIsRegionOpen}
          className="min-w-0 text-[14px] lg:text-lg"
          buttonClassName="w-[100px] h-9 pr-[10px] pl-[14px] md:w-[120px] lg:w-[160px] lg:h-[50px] rounded-[8px] lg:rounded-[12px] lg:pr-3 lg:pl-[20px] border border-gray-300"
          dropdownClassName=""
          dropdownWidth={deviceType === "desktop" ? 400 : 200}
          dropdownHeight={deviceType === "desktop" ? 320 : 180}
          optionClassName="py-[6px] px-[14px] text-[14px] leading-[24px] lg:py-[19px] lg:px-[24px] lg:text-2lg "
        />
        {/* 서비스 타입 필터 */}
        <CustomDropdown
          options={serviceOptions}
          value={serviceTypeId}
          onChange={(value) => setServiceTypeId(value as number)}
          placeholder={t("service")}
          onOpenChange={setIsServiceOpen}
          className="min-w-0 text-[14px] lg:text-lg"
          buttonClassName="w-[100px] h-9 pr-[10px] pl-[14px] md:w-[120px] lg:w-[160px] lg:h-[50px] rounded-[8px] lg:rounded-[12px] lg:pr-3 lg:pl-[20px] border border-gray-300 ml-3"
          dropdownClassName="ml-3"
          dropdownWidth={deviceType === "desktop" ? 160 : 106}
          dropdownHeight={deviceType === "desktop" ? 240 : 160}
          optionClassName="py-2 px-[14px] text-[14px] lg:py-[17px] lg:px-[24px] lg:text-2lg "
        />
        {/* 초기화 버튼 -> 데스크탑에서만 보임 */}
        {deviceType === "desktop" && (
          <button
            type="button"
            onClick={reset}
            className="hover:text-primary-400 ml-[25px] text-lg font-medium text-[#ababab] focus:outline-none"
          >
            {t("reset")}
          </button>
        )}
      </div>
      {/* 정렬 */}
      <SortBar />
    </div>
  );
};

export default FilterBar;
