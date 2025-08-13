import React from "react";
import { formatRelativeTimeWithTranslations } from "@/utils/dateUtils";
import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import { useTranslations, useLocale } from "next-intl";
import confirm from "@/assets/icon/etc/icon-confirm.svg";
import Image from "next/image";

interface ILabelAreaProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  createdAt?: Date;
  usedAt: "received" | "sent" | "rejected" | "detail";
  estimateStatus?: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
}
export const LabelArea = ({ movingType, isDesignated, createdAt, usedAt, estimateStatus }: ILabelAreaProps) => {
  const t = useTranslations("moverEstimate");
  const locale = useLocale();

  return (
    <section
      className="flex w-full flex-row items-center justify-between gap-2"
      aria-label={t("ariaLabels.labelArea")}
      role="region"
    >
      <section
        className="flex flex-row items-center justify-center gap-2"
        aria-label={t("ariaLabels.movingTypeSection")}
        role="group"
      >
        <MoveTypeLabel type={movingType} aria-label={t("ariaLabels.movingTypeLabel")} />
        {isDesignated && <MoveTypeLabel type="document" aria-label={t("ariaLabels.designatedLabel")} />}
      </section>

      {usedAt === "received" && createdAt && (
        <section
          className="text-[14px] leading-[24px] font-normal text-gray-500"
          aria-label={t("ariaLabels.timeSection")}
          role="group"
        >
          <span aria-label={t("ariaLabels.relativeTime")}>
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
        </section>
      )}

      {usedAt === "detail" && (
        <section
          className="flex flex-row items-center justify-end gap-1 md:hidden"
          aria-label={t("ariaLabels.statusSection")}
          role="group"
        >
          {estimateStatus === "PROPOSED" ? (
            <p
              className="text-[16px] leading-[26px] font-semibold text-gray-300"
              aria-label={t("ariaLabels.estimateStatus")}
            >
              {t("estimateWaiting")}
            </p>
          ) : estimateStatus === "ACCEPTED" ? (
            <div
              className="flex flex-row items-center justify-center gap-1"
              aria-label={t("ariaLabels.confirmedEstimate")}
              role="group"
            >
              <Image src={confirm} alt="" width={16} height={16} className="object-contain" aria-hidden="true" />
              <p className="text-primary-400 text-[16px] leading-[26px] font-bold">{t("confirmedEstimate")}</p>
            </div>
          ) : (
            <p
              className="text-[16px] leading-[26px] font-semibold text-gray-300"
              aria-label={t("ariaLabels.rejectedEstimate")}
            >
              {t("rejectedEstimate")}
            </p>
          )}
        </section>
      )}
    </section>
  );
};
