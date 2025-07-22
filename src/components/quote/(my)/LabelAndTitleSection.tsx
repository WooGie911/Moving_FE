import React from "react";
import { MoveTypeLabel } from "../../common/chips/MoveTypeLabel";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";
import { TMoverInfo } from "@/types/customerEstimateRequest";

interface IProps {
  mover: TMoverInfo;
  isDesignated: boolean;
  estimateState: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
  estimateTitle: string;
  type: "pending" | "received";
  usedAtDetail: boolean;
}

// 서비스 타입 이름을 MoveTypeLabel 타입으로 매핑하는 함수
const mapServiceTypeToMoveType = (serviceName: string): "small" | "home" | "office" | "document" => {
  switch (serviceName) {
    case "소형이사":
      return "small";
    case "가정이사":
      return "home";
    case "사무실이사":
      return "office";
    default:
      return "home"; // 기본값
  }
};

export const LabelAndTitleSection = ({
  mover,
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
          {/* mover의 serviceTypes에 따라 여러 라벨 표시 */}
          {mover.serviceTypes?.map((serviceType: string, index: number) => (
            <MoveTypeLabel key={index} type={mapServiceTypeToMoveType(serviceType)} />
          ))}
          {isDesignated ? <MoveTypeLabel type="document" /> : ""}
        </div>
        {/* 확정견적인지 + 견적상태  모바일만 표시 */}

        {estimateState === "PROPOSED" ? (
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
            {estimateState === "REJECTED" || estimateState === "AUTO_REJECTED" ? "반려견적" : estimateState}
          </p>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-center gap-1">
        <h1
          className={`text-black-300 flex-1 leading-[26px] font-semibold ${usedAtDetail ? "text-[18px] md:text-[24px]" : "truncate text-[16px] md:text-[18px]"}`}
          title={estimateTitle}
        >
          {usedAtDetail
            ? (() => {
                const sentences = estimateTitle.split(".");
                if (sentences.length >= 2) {
                  const first = sentences[0].trim();
                  const second = sentences[1].trim();
                  return (
                    <>
                      {first}.
                      <br />
                      {second}
                    </>
                  );
                } else {
                  return estimateTitle;
                }
              })()
            : estimateTitle.length > 30
              ? `${estimateTitle.substring(0, 30)}...`
              : estimateTitle}
        </h1>
        {type === "pending" ? (
          ""
        ) : estimateState === "PROPOSED" ? (
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
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">반려견적</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
