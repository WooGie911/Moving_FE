import { Checkbox } from "@/components/common/input/Checkbox";
import React from "react";
import { useTranslations } from "next-intl";

interface SelectCheckBoxProps {
  isDesignatedOnly: boolean;
  isServiceAreaOnly: boolean;
  onDesignatedChange: (checked: boolean) => void;
  onServiceAreaChange: (checked: boolean) => void;
}

export const SelectCheckBox = ({
  isDesignatedOnly,
  isServiceAreaOnly,
  onDesignatedChange,
  onServiceAreaChange,
}: SelectCheckBoxProps) => {
  const t = useTranslations("moverEstimate");

  return (
    <fieldset
      className="flex flex-col items-start justify-center gap-2 lg:flex-row"
      aria-label={t("ariaLabels.regionSection")}
    >
      <legend className="sr-only">{t("regionAndEstimate")}</legend>

      <div className="flex items-center">
        <Checkbox
          label={t("designatedEstimateRequest")}
          type="square"
          checked={isDesignatedOnly}
          onChange={onDesignatedChange}
          aria-describedby="designated-description"
        />
        <span id="designated-description" className="sr-only">
          지정 견적 요청만 표시합니다
        </span>
      </div>

      <div className="flex items-center">
        <Checkbox
          label={t("serviceAvailableArea")}
          type="square"
          checked={isServiceAreaOnly}
          onChange={onServiceAreaChange}
          aria-describedby="service-area-description"
        />
        <span id="service-area-description" className="sr-only">
          서비스 가능 지역 내 견적만 표시합니다
        </span>
      </div>
    </fieldset>
  );
};
