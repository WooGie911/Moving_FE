"use client";

import React from "react";
import { TextInput } from "@/components/common/input/TextInput";
import { PasswordInput } from "@/components/common/input/PasswordInput";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { useTranslations } from "next-intl";

interface IProfileEditFormFieldProps {
  type: "text" | "password" | "textarea";
  name: string;
  labelKey: string;
  placeholderKey: string;
  rules: any;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  inputClassName?: string;
  wrapperClassName?: string;
  className?: string;
}

export const ProfileEditFormField = ({
  type,
  name,
  labelKey,
  placeholderKey,
  rules,
  required = false,
  optional = false,
  disabled = false,
  inputClassName,
  wrapperClassName,
  className = "",
}: IProfileEditFormFieldProps) => {
  const t = useTranslations("profile");

  return (
    <fieldset className={`flex flex-col gap-4 ${className}`}>
      <legend className="inline-flex items-center gap-1">
        <div className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
          {t(labelKey)}
        </div>
        {required && (
          <div className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</div>
        )}
        {optional && <div className="text-sm text-gray-500">{t("optional")}</div>}
      </legend>
      <div className={`border-border-light w-[327px] border-b-1 pb-10 lg:w-full ${wrapperClassName || ""}`}>
        {type === "text" && (
          <TextInput
            name={name}
            placeholder={t(placeholderKey)}
            rules={rules}
            inputClassName={inputClassName}
            wrapperClassName={wrapperClassName || "w-[327px] lg:w-[500px] h-[54px]"}
          />
        )}
        {type === "password" && (
          <PasswordInput
            name={name}
            placeholder={t(placeholderKey)}
            rules={rules}
            wrapperClassName={wrapperClassName || "w-[327px] lg:w-[500px] h-[54px]"}
          />
        )}
        {type === "textarea" && (
          <TextAreaInput
            name={name}
            placeholder={t(placeholderKey)}
            rules={rules}
            wrapperClassName={wrapperClassName || "w-[327px] lg:w-[500px]"}
          />
        )}
      </div>
    </fieldset>
  );
};
