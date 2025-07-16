import { Checkbox } from "@/components/common/input/Checkbox";
import React from "react";

export const SelectCheckBox = () => {
  return (
    <div className="flex flex-col items-start justify-center gap-2 lg:flex-row">
      <Checkbox label="지정 견적 요청" type="square" />
      <Checkbox label="서비스 가능 지역" type="square" />
    </div>
  );
};
