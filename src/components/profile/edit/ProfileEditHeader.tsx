"use client";

import React from "react";
import { useTranslations } from "next-intl";

interface IProfileEditHeaderProps {
  titleKey: string;
  className?: string;
}

export const ProfileEditHeader = ({ titleKey, className = "" }: IProfileEditHeaderProps) => {
  const t = useTranslations("profile");

  return (
    <header
      className={`border-border-light flex max-w-[327px] flex-col border-b-1 pb-4 lg:max-w-[1100px] ${className}`}
    >
      <h1 className="text-2lg justify-center leading-relaxed font-bold text-neutral-800 lg:text-3xl">{t(titleKey)}</h1>
    </header>
  );
};
