import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";
import { SelectMovinType } from "./SelectMovinType";
import { SelectCheckBox } from "./SelectCheckBox";
import { Dropdown } from "./Dropdown";

export const PcFillterSection = () => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-10">
      {/* 이사유형 선택 라벨*/}
      <SelectMovinType />
      <div className="flex w-full flex-row items-center justify-start pt-6">
        <p className="text-black-500 text-[18px] leading-[26px] font-semibold">{`전체 ${30}건`}</p>
      </div>
      <div className="flex w-full flex-row items-center justify-between">
        <SelectCheckBox />
        <Dropdown />
      </div>
    </div>
  );
};
