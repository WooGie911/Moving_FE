import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";

export const SelectMovinType = () => {
  return (
    <div className="flex flex-row items-center justify-center gap-3">
      <CircleTextLabel text="소형이사" clickAble={true} />
      <CircleTextLabel text="가정이사" clickAble={true} />
      <CircleTextLabel text="사무실이사" clickAble={true} />
    </div>
  );
};
