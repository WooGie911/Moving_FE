import React from "react";
import { formatRelativeTime } from "@/utils/dateUtils";
import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  createdAt?: Date;
}
export const LabelArea = ({ movingType, isDesignated, createdAt }: ILabelAreaProps) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MoveTypeLabel type={movingType} />
        {isDesignated ? <MoveTypeLabel type="document" /> : ""}
      </div>

      {createdAt && (
        <span className="text-[14px] leading-[24px] font-normal text-gray-500">{formatRelativeTime(createdAt)}</span>
      )}
    </div>
  );
};
