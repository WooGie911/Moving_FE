import React from "react";
import { MoveTypeLabel } from "../../common/chips/MoveTypeLabel";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";

interface IProps {
  moveType: "home" | "office" | "document" | "small";
  isDesignated: boolean;
  estimateState: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SENT";
  estimateTitle: string;
  type: "pending" | "received";
  usedAtDetail: boolean;
}

export const LabelAndTitleSection = ({
  moveType,
  isDesignated,
  estimateState,
  estimateTitle,
  type,
  usedAtDetail = false,
}: IProps) => {
  return (
    <div className="border-border-light flex w-full flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-between">
        {/* 이사타입과 지정견적 라벨 */}
        <div className="flex flex-row gap-2">
          <MoveTypeLabel type={moveType} />
          {isDesignated ? <MoveTypeLabel type="document" /> : ""}
        </div>
        {/* 확정견적인지 + 견적상태  모바일만 표시 */}

        {estimateState === "PENDING" ? (
          <p
            className={`text-[16px] leading-[26px] font-semibold text-gray-300 ${type === "received" ? "md:hidden" : ""}`}
          >
            견적대기
          </p>
        ) : estimateState === "ACCEPTED" ? (
          <div className={`flex flex-row items-center justify-end gap-1 ${type === "received" ? "md:hidden" : ""}`}>
            <Image src={confirm} alt="confirm" width={16} height={16} />
            <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
          </div>
        ) : (
          <p
            className={`text-[16px] leading-[26px] font-semibold text-gray-300 ${type === "received" ? "md:hidden" : ""}`}
          >
            {estimateState}
          </p>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-center gap-1">
        <h1
          className={`text-black-300 flex-1 leading-[26px] font-semibold ${usedAtDetail ? "text-[18px] md:text-[24px]" : "text-[16px] md:text-[18px]"}`}
        >
          {estimateTitle}
        </h1>
        {type === "pending" ? (
          ""
        ) : estimateState === "PENDING" ? (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">견적대기</p>
            </div>
          </div>
        ) : estimateState === "ACCEPTED" ? (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <Image src={confirm} alt="confirm" width={16} height={16} />
              <p className="text-primary-400 text-[16px] leading-[26px] font-bold">확정견적</p>
            </div>
          </div>
        ) : (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{estimateState}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
