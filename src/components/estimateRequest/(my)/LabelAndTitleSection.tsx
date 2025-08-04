import React from "react";
import { MoveTypeLabel } from "../../common/chips/MoveTypeLabel";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";
import { ILabelAndTitleSectionProps, TMoverInfo } from "@/types/customerEstimateRequest";
import { useTranslations } from "next-intl";
import { mapServiceTypeToMoveType } from "@/lib/utils/mapServiceTypeToMoveType";

export const LabelAndTitleSection = ({ mover, estimate, usedAt }: ILabelAndTitleSectionProps) => {
  const t = useTranslations("estimateRequest");
  return (
    <div className="border-border-light flex w-full flex-col gap-3">
      <div className="flex w-full flex-row items-center justify-between">
        {/* 이사타입과 지정견적 라벨 */}
        <div className="flex flex-row gap-2">
          {/* mover의 serviceTypes에 따라 여러 라벨 표시 */}
          {mover.serviceTypes?.map((serviceType: string, index: number) => (
            <MoveTypeLabel key={index} type={mapServiceTypeToMoveType(serviceType)} />
          ))}
          {estimate.isDesignated ? <MoveTypeLabel type="document" /> : ""}
        </div>
        {/* 확정견적인지 + 견적상태  모바일만 표시 */}
        {usedAt === "detail" ? (
          ""
        ) : (
          <>
            {estimate.status === "PROPOSED" ? (
              <p
                className={`text-[14px] leading-[26px] font-semibold text-gray-300 ${usedAt === "received" ? "md:hidden" : ""}`}
              >
                {t("estimateWaiting")}
              </p>
            ) : estimate.status === "ACCEPTED" ? (
              <div
                className={`flex flex-row items-center justify-end gap-1 ${usedAt === "received" ? "md:hidden" : ""}`}
              >
                <Image src={confirm} alt="confirm" width={16} height={16} />
                <p className="text-primary-400 text-[14px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
              </div>
            ) : (
              <p
                className={`text-[14px] leading-[26px] font-semibold text-gray-300 ${usedAt === "received" ? "md:hidden" : ""}`}
              >
                {estimate.status === "REJECTED" || estimate.status === "AUTO_REJECTED"
                  ? t("rejectedEstimate")
                  : estimate.status}
              </p>
            )}
          </>
        )}
      </div>
      <div className="flex w-full flex-row items-center justify-center gap-1">
        <h1
          className={`text-black-300 flex-1 leading-[26px] font-semibold ${usedAt === "detail" ? "text-[18px] md:text-[24px]" : "truncate text-[16px] md:text-[18px]"}`}
          title={estimate.comment || ""}
        >
          {usedAt === "detail"
            ? (() => {
                const sentences = estimate.comment?.split(".") || [];
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
                  return estimate.comment || "";
                }
              })()
            : estimate.comment!.length > 30
              ? `${estimate.comment?.substring(0, 30)}...`
              : estimate.comment || ""}
        </h1>
        {usedAt === "pending" ? (
          ""
        ) : estimate.status === "PROPOSED" ? (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{t("estimateWaiting")}</p>
            </div>
          </div>
        ) : estimate.status === "ACCEPTED" ? (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <Image src={confirm} alt="confirm" width={16} height={16} />
              <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
            </div>
          </div>
        ) : (
          <div className="hidden min-w-fit flex-shrink-0 md:block">
            <div className="flex flex-row items-center justify-end gap-1">
              <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{t("rejectedEstimate")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
