"use client";

import React from "react";
import { Button } from "@/components/common/button/Button";
import { useTranslations } from "next-intl";

interface IProfileEditActionButtonsProps {
  onCancel: () => void;
  onSubmit: () => void;
  disabled?: boolean;
  className?: string;
}

export const ProfileEditActionButtons = ({
  onCancel,
  onSubmit,
  disabled = false,
  className = "",
}: IProfileEditActionButtonsProps) => {
  const t = useTranslations("profile");

  return (
    <section
      className={`mt-6 flex w-[327px] flex-col gap-2 lg:mt-12 lg:w-full lg:flex-row lg:gap-5 lg:self-end ${className}`}
    >
      <Button
        variant="outlined"
        state="default"
        width="w-full"
        height="h-[54px] lg:h-[60px]"
        className="order-2 items-center justify-center rounded-2xl border !border-[#C4C4C4] bg-white px-6 py-4 text-base leading-relaxed font-semibold !text-[#C4C4C4] shadow-none outline outline-1 outline-offset-[-1px] lg:order-1"
        onClick={onCancel}
      >
        <div className="justify-center text-center">{t("cancel")}</div>
      </Button>
      <Button
        variant="solid"
        width="w-full"
        height="h-[54px] lg:h-[60px]"
        className="order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2"
        onClick={onSubmit}
        disabled={disabled}
        state={disabled ? "disabled" : "default"}
      >
        <div className="justify-center text-center">{t("editButton")}</div>
      </Button>
    </section>
  );
};
