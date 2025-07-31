"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface IProfileFormHeaderProps {
  titleKey: string;
  descriptionKey: string;
  className?: string;
}

export const ProfileFormHeader = ({ titleKey, descriptionKey, className = "" }: IProfileFormHeaderProps) => {
  const t = useTranslations("profile");

  return (
    <header
      className={`border-border-light flex flex-col items-start justify-center self-stretch border-b-1 pb-4 ${className}`}
      aria-label={t("aria.headerLabel")}
    >
      <h1 className="text-2lg justify-center leading-relaxed font-bold text-neutral-800 lg:text-3xl">{t(titleKey)}</h1>
      <p className="text-black-200 py-2 text-xs lg:text-xl">{t(descriptionKey)}</p>
    </header>
  );
};
