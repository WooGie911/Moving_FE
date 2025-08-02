import React from "react";
import { formatRelativeTimeWithTranslations } from "@/utils/dateUtils";
import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import { useTranslations, useLocale } from "next-intl";
import confirm from "@/assets/icon/etc/icon-confirm.png";
import Image from "next/image";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  createdAt?: Date;
  usedAt: "received" | "sent" | "rejected" | "detail";
  estimateStatus?: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
}
export const LabelArea = ({ movingType, isDesignated, createdAt, usedAt, estimateStatus }: ILabelAreaProps) => {
  const t = useTranslations("relativeTime");
  const estimateT = useTranslations("estimateRequest");
  const locale = useLocale();
  console.log("디테일페이지", estimateStatus);
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MoveTypeLabel type={movingType} />
        {isDesignated ? <MoveTypeLabel type="document" /> : ""}
      </div>

      {usedAt === "received" && createdAt && (
        <span className="text-[14px] leading-[24px] font-normal text-gray-500">
          {formatRelativeTimeWithTranslations(
            createdAt,
            {
              justNow: t("justNow"),
              minutesAgo: t("minutesAgo"),
              hoursAgo: t("hoursAgo"),
              daysAgo: t("daysAgo"),
            },
            locale === "ko" ? "ko-KR" : locale === "en" ? "en-US" : "zh-CN",
          )}
        </span>
      )}

      {usedAt === "detail" && (
        <div className="flex flex-row items-center justify-end gap-1 md:hidden">
          {estimateStatus === "PROPOSED" ? (
            <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{estimateT("estimateWaiting")}</p>
          ) : estimateStatus === "ACCEPTED" ? (
            <div className="flex flex-row items-center justify-center gap-1">
              <Image src={confirm} alt="confirm" width={16} height={16} />
              <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{estimateT("confirmedEstimate")}</p>
            </div>
          ) : (
            <p className="text-[16px] leading-[26px] font-semibold text-gray-300">{estimateT("rejectedEstimate")}</p>
          )}
        </div>
      )}
    </div>
  );
};
