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
  const t = useTranslations("estimate");
  return (
    <div className="flex flex-col items-start justify-center gap-2 lg:flex-row">
      <Checkbox
        label={t("designatedEstimateRequest")}
        type="square"
        checked={isDesignatedOnly}
        onChange={onDesignatedChange}
      />
      <Checkbox
        label={t("serviceAvailableArea")}
        type="square"
        checked={isServiceAreaOnly}
        onChange={onServiceAreaChange}
      />
    </div>
  );
};
