import { CircleTextLabel } from "@/components/common/chips/CircleTextLabel";
import React from "react";

const Chip = () => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">제공 서비스</p>
        <div className="flex gap-2 md:gap-3">
          <CircleTextLabel text="소형이사" hasBorder1={true} hasBorder2={true} />
          <CircleTextLabel text="가정이사" hasBorder1={true} hasBorder2={true} />
        </div>
      </div>
      <div className="flex flex-col gap-2 md:gap-4">
        <p className="text-lg font-semibold md:text-xl">서비스 가능 지역</p>
        <div className="flex gap-2 md:gap-3">
          <CircleTextLabel text="서울" hasBorder1={true} />
          <CircleTextLabel text="경기" hasBorder1={true} />
        </div>
      </div>
    </div>
  );
};

export default Chip;
