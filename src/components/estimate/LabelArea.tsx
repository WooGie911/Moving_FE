import React from "react";
import { MoveTypeLabel } from "../common/chips/MoveTypeLabel";
import { formatRelativeTime } from "@/utils/dateUtils";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  createdAt?: Date;
  type: "received" | "sent" | "rejected";
  status?: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
}
export const LabelArea = ({ movingType, isDesignated, createdAt, type, status }: ILabelAreaProps) => {
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MoveTypeLabel type={movingType} />
        {isDesignated ? <MoveTypeLabel type="document" /> : ""}
      </div>

      {type === "received" && createdAt && (
        <span className="text-[14px] leading-[24px] font-normal text-gray-500">{formatRelativeTime(createdAt)}</span>
      )}
      {type === "sent" && status === "ACCEPTED" && (
        <div className="flex flex-row items-center justify-center gap-1">
          <Image src={confirm} alt="confirm" width={16} height={16} />
          <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
        </div>
      )}
    </div>
  );
};
