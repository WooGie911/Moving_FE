"use client";

import React, { useEffect, useState } from "react";
import { useSearchMoverStore } from "@/stores/searchMoverStore";
import CustomDropdown from "@/components/common/dropdown/CustomDropdown";
import findMoverApi from "@/lib/api/findMover.api";
import { getRegionLabel, getRegionOptions } from "@/lib/utils/regionMapping";
import SortBar from "@/components/searchMover/SortBar";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { Option } from "@/types/dropdown";

const FilterBar = () => {
  const { region, setRegion, serviceTypeId, setServiceTypeId, reset } = useSearchMoverStore();
  const [regionOptions, setRegionOptions] = useState<Option[]>([{ value: "", label: "전체" }]);
  const [serviceOptions, setServiceOptions] = useState<Option[]>([{ value: "", label: "전체" }]);
  const [loading, setLoading] = useState(true);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const deviceType = useWindowWidth();

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        const [regions, serviceTypes] = await Promise.all([
          findMoverApi.fetchRegions(),
          findMoverApi.fetchServiceTypes(),
        ]);
        const regionOpts = [
          { value: "", label: "전체" },
          ...regions.map((region) => ({ value: region, label: getRegionLabel(region) })),
        ];
        setRegionOptions(regionOpts);
        const serviceOpts = [
          { value: "", label: "전체" },
          ...serviceTypes.map((service) => ({ value: service.id, label: service.name })),
        ];
        setServiceOptions(serviceOpts);
      } catch (error) {
        const defaultRegionOptions = getRegionOptions();
        setRegionOptions([{ value: "", label: "전체" }, ...defaultRegionOptions]);
        setServiceOptions([
          { value: "", label: "전체" },
          { value: 1, label: "가정이사" },
          { value: 2, label: "사무실이사" },
          { value: 3, label: "소형이사" },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchFilterOptions();
  }, []);

  // TODO: 스켈레톤 우선 적용해봄. 추후에 스켈레톤 파일로 뺄 예정
  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
        <div className="h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
        <div className="ml-2 h-[32px] w-[48px] animate-pulse rounded bg-gray-200" />
        <div className="ml-2 h-[50px] w-[160px] animate-pulse rounded-[12px] bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="mb-7 flex w-[327px] items-center justify-between md:mb-10 md:w-150 lg:mb-[37px] lg:w-full">
      <div className="flex w-full items-center">
        {/* 지역 필터 */}
        <CustomDropdown
          options={regionOptions}
          value={region}
          onChange={(value) => setRegion(value as string)}
          placeholder="지역"
          twoColumns={true}
          onOpenChange={setIsRegionOpen}
          className="min-w-0 text-[14px] lg:text-lg"
          buttonClassName="w-[87px] h-9 pr-[10px] pl-[14px] lg:w-[160px] lg:h-[50px] rounded-[8px] lg:rounded-[12px] lg:pr-3 lg:pl-[20px] border border-gray-300"
          dropdownClassName=""
          dropdownWidth={deviceType === "desktop" ? 328 : 150}
          dropdownHeight={deviceType === "desktop" ? 320 : 180}
          optionClassName="py-[6px] px-[14px] text-[14px] leading-[24px] lg:py-[19px] lg:px-[24px] lg:text-2lg "
        />
        {/* 서비스 타입 필터 */}
        <CustomDropdown
          options={serviceOptions}
          value={serviceTypeId}
          onChange={(value) => setServiceTypeId(value as number)}
          placeholder="서비스"
          onOpenChange={setIsServiceOpen}
          className="min-w-0 text-[14px] lg:text-lg"
          buttonClassName="w-[87px] h-9 pr-[10px] pl-[14px] lg:w-[160px] lg:h-[50px] rounded-[8px] lg:rounded-[12px] lg:pr-3 lg:pl-[20px] border border-gray-300 ml-3"
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
            초기화
          </button>
        )}
      </div>
      {/* 정렬 */}
      <SortBar />
    </div>
  );
};

export default FilterBar;
