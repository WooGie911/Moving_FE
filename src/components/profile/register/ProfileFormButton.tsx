"use client";

import React from "react";
import { Button } from "@/components/common/button/Button";
import { useTranslations } from "next-intl";

interface IProfileFormButtonProps {
  onClick: () => void;
  disabled: boolean;
  className?: string;
  buttonText?: string;
}

export const ProfileFormButton = ({ onClick, disabled, className = "", buttonText }: IProfileFormButtonProps) => {
  const t = useTranslations("profile");

  return (
    <div className={`flex w-[327px] flex-col gap-2 lg:w-full lg:flex-row lg:gap-5 ${className}`}>
      <Button
        variant="solid"
        width="w-full"
        height="h-[54px] lg:h-[60px]"
        className="order-1 items-center justify-center rounded-2xl bg-[#F9502E] p-4 text-base leading-relaxed font-semibold text-white lg:order-2"
        onClick={onClick}
        disabled={disabled}
        state={disabled ? "disabled" : "default"}
      >
        <div className="justify-center text-center">{buttonText || t("start")}</div>
      </Button>
    </div>
  );
};
