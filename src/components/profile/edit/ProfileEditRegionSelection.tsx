"use client";

import React from "react";
import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import { useTranslations, useLocale } from "next-intl";

interface IProfileEditRegionSelectionProps {
  selectedRegions: string | string[];
  onRegionsChange: (regions: string | string[]) => void;
  regionOptions: string[];
  regionMapping: { [key: string]: string };
  titleKey: string;
  descriptionKey: string;
  multiple?: boolean;
  className?: string;
}

export const ProfileEditRegionSelection = ({
  selectedRegions,
  onRegionsChange,
  regionOptions,
  regionMapping,
  titleKey,
  descriptionKey,
  multiple = false,
  className = "",
}: IProfileEditRegionSelectionProps) => {
  const t = useTranslations("profile");
  const regionT = useTranslations("region");
  const locale = useLocale();

  return (
    <fieldset className={`flex flex-col gap-6 ${className}`}>
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1">
          <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
            {t(titleKey)}
          </div>
          <div className="text-base leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
        </div>
        <span className="text-xs text-gray-400 lg:text-lg">* {t(descriptionKey)}</span>
      </div>

      <div className="flex w-[320px] flex-col gap-4 lg:w-[450px]">
        <div className={`grid w-full gap-2 lg:gap-3.5 ${locale === "en" ? "grid-cols-3" : "grid-cols-5"}`}>
          {regionOptions.map((region) => {
            const regionValue = regionMapping[region as keyof typeof regionMapping];
            const isSelected = multiple
              ? (selectedRegions as string[]).includes(regionValue)
              : selectedRegions === regionValue;

            return (
              <CircleTextLabel
                key={region}
                text={regionT(region)}
                clickAble={true}
                isSelected={isSelected}
                onClick={() => {
                  if (multiple) {
                    const currentRegions = selectedRegions as string[];
                    onRegionsChange(
                      currentRegions.includes(regionValue)
                        ? currentRegions.filter((r) => r !== regionValue)
                        : [...currentRegions, regionValue],
                    );
                  } else {
                    onRegionsChange(selectedRegions === regionValue ? "" : regionValue);
                  }
                }}
              />
            );
          })}
        </div>
      </div>
    </fieldset>
  );
};
