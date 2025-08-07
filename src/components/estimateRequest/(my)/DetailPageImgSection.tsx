import Image from "next/image";
import React from "react";
import detailPageHeaderImg from "@/assets/img/etc/detail-header.webp";
import { useTranslations } from "next-intl";

export const DetailPageImgSection = () => {
  const t = useTranslations("estimateRequest");

  return (
    <section className="relative h-[122px] w-full" aria-label={t("detailPageHeader")}>
      <Image
        src={detailPageHeaderImg}
        alt={t("detailPageHeaderAlt")}
        className="object-cover md:h-[157px] lg:h-[180px]"
        priority
        aria-hidden="false"
      />
    </section>
  );
};
