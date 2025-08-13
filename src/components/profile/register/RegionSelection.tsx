"use client";

import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { REGION_OPTIONS, REGION_MAPPING } from "@/constant/profile";
import { useTranslations, useLocale } from "next-intl";

interface IRegionSelectionProps {
  selectedRegions: string | string[];
  onRegionsChange: (regions: string | string[]) => void;
  titleKey: string;
  descriptionKey?: string;
  multiple?: boolean;
  className?: string;
}

export const RegionSelection = ({
  selectedRegions,
  onRegionsChange,
  titleKey,
  descriptionKey,
  multiple = false,
  className = "",
}: IRegionSelectionProps) => {
  const t = useTranslations("profile");
  const regionT = useTranslations("region");
  const locale = useLocale();

  const handleRegionToggle = (regionValue: string) => {
    if (multiple) {
      const regionsArray = selectedRegions as string[];
      onRegionsChange(
        regionsArray.includes(regionValue)
          ? regionsArray.filter((r) => r !== regionValue)
          : [...regionsArray, regionValue],
      );
    } else {
      const currentRegion = selectedRegions as string;
      onRegionsChange(currentRegion === regionValue ? "" : regionValue);
    }
  };

  const isSelected = (regionValue: string) => {
    if (multiple) {
      return (selectedRegions as string[]).includes(regionValue);
    }
    return (selectedRegions as string) === regionValue;
  };

  // ✅ titleKey 기반으로 customer vs mover ARIA 분기 처리
  const ariaLabelKey =
    titleKey === "currentAreas" ? "aria.regionSelectionLabelMover" : "aria.regionSelectionLabelCustomer";

  return (
    <div className={`flex flex-col gap-6 ${className}`} aria-label={t(ariaLabelKey)}>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1">
          <span className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
            {t(titleKey)}
          </span>
          <span className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</span>
        </div>
        {descriptionKey && <span className="text-xs text-gray-400 lg:text-lg">* {t(descriptionKey)}</span>}
      </div>

      <div className="flex w-[320px] flex-col gap-4 lg:w-[450px]">
        <div className={`grid w-full gap-2 lg:gap-3.5 ${locale === "en" ? "grid-cols-3" : "grid-cols-5"}`}>
          {REGION_OPTIONS.map((region) => {
            const regionValue = REGION_MAPPING[region as keyof typeof REGION_MAPPING];
            return (
              <CircleTextLabel
                key={region}
                text={regionT(region)}
                clickAble={true}
                isSelected={isSelected(regionValue)}
                onClick={() => handleRegionToggle(regionValue)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
