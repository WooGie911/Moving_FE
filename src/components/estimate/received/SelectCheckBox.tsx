import { Checkbox } from "@/components/common/input/Checkbox";
import React from "react";

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
  return (
    <div className="flex flex-col items-start justify-center gap-2 lg:flex-row">
      <Checkbox label="지정 견적 요청" type="square" checked={isDesignatedOnly} onChange={onDesignatedChange} />
      <Checkbox label="서비스 가능 지역" type="square" checked={isServiceAreaOnly} onChange={onServiceAreaChange} />
    </div>
  );
};
