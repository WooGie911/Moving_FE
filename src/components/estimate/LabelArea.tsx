import React from "react";
import { formatRelativeTimeWithTranslations } from "@/utils/dateUtils";
import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import { useTranslations, useLocale } from "next-intl";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  createdAt?: Date;
  type: "received" | "sent" | "rejected" | "detail";
}
export const LabelArea = ({ movingType, isDesignated, createdAt, type }: ILabelAreaProps) => {
  const t = useTranslations("relativeTime");
  const locale = useLocale();
  return (
    <div className="flex w-full flex-row items-center justify-between gap-2">
      <div className="flex flex-row items-center justify-center gap-2">
        <MoveTypeLabel type={movingType} />
        {isDesignated ? <MoveTypeLabel type="document" /> : ""}
      </div>

      {type === "received" && createdAt && (
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
    </div>
  );
};
