import React from "react";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
}
export const LabelArea = ({ movingType, isDesignated }: ILabelAreaProps) => {
  return (
    <div className="flex flex-row items-center justify-center gap-2">
      <MoveTypeLabel type={movingType} />
      {isDesignated ? <MoveTypeLabel type="document" /> : ""}
    </div>
  );
};
