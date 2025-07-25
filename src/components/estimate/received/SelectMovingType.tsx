import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { useTranslations } from "next-intl";

interface SelectMovingTypeProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

export const SelectMovingType = ({ selectedTypes, onTypeChange }: SelectMovingTypeProps) => {
  const t = useTranslations("estimate");

  const movingTypes = [
    { text: t("movingTypesFilter.small"), value: "SMALL" },
    { text: t("movingTypesFilter.home"), value: "HOME" },
    { text: t("movingTypesFilter.office"), value: "OFFICE" },
  ];

  return (
    <div className="flex flex-row items-center justify-center gap-3">
      {movingTypes.map((type) => (
        <CircleTextLabel
          key={type.value}
          text={type.text}
          clickAble={true}
          isSelected={selectedTypes.includes(type.value)}
          onClick={() => onTypeChange(type.value)}
        />
      ))}
    </div>
  );
};
