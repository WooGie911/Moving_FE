import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { useTranslations } from "next-intl";

interface SelectMovingTypeProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

export const SelectMovingType = ({ selectedTypes, onTypeChange }: SelectMovingTypeProps) => {
  const t = useTranslations("moverEstimate");

  const movingTypes = [
    { text: t("movingTypesFilter.small"), value: "SMALL" },
    { text: t("movingTypesFilter.home"), value: "HOME" },
    { text: t("movingTypesFilter.office"), value: "OFFICE" },
  ];

  return (
    <fieldset
      className="flex flex-row items-center justify-center gap-3"
      aria-label={t("ariaLabels.movingTypeSection")}
    >
      <legend className="sr-only">{t("movingType")}</legend>

      {movingTypes.map((type) => (
        <div key={type.value} className="flex items-center">
          <CircleTextLabel
            text={type.text}
            clickAble={true}
            isSelected={selectedTypes.includes(type.value)}
            onClick={() => onTypeChange(type.value)}
            aria-pressed={selectedTypes.includes(type.value)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTypeChange(type.value);
              }
            }}
          />
        </div>
      ))}
    </fieldset>
  );
};
