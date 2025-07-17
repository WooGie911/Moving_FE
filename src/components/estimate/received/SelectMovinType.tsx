import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";

interface SelectMovinTypeProps {
  selectedTypes: string[];
  onTypeChange: (type: string) => void;
}

export const SelectMovinType = ({ selectedTypes, onTypeChange }: SelectMovinTypeProps) => {
  const movingTypes = [
    { text: "소형이사", value: "SMALL" },
    { text: "가정이사", value: "HOME" },
    { text: "사무실이사", value: "OFFICE" },
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
