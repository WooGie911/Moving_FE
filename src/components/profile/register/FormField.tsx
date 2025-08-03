"use client";

import React from "react";
import { TextInput } from "@/components/common/input/TextInput";
import { TextAreaInput } from "@/components/common/input/TextAreaInput";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";

interface IFormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  rules?: any;
  required?: boolean;
  type?: "text" | "textarea";
  wrapperClassName?: string;
  textareaClassName?: string;
  methods: UseFormReturn<any>;
  className?: string;
}

export const FormField = ({
  name,
  label,
  placeholder,
  rules,
  required = true,
  type = "text",
  wrapperClassName = "w-[327px] lg:w-[500px] h-[54px]",
  textareaClassName = "w-[327px] h-[100px] lg:w-[500px] border border-[1px] !border-[#E6E6E6]",
  methods,
  className = "",
}: IFormFieldProps) => {
  const t = useTranslations("profile");

  return (
    <fieldset className={`flex flex-col gap-4 ${className}`} aria-label={t("aria.formFieldLabel", { field: label })}>
      <legend className="inline-flex items-center gap-1">
        <span className="text-lg leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">{label}</span>
        {required && (
          <span className="text-lg leading-relaxed font-semibold text-red-500 lg:text-xl lg:leading-loose">*</span>
        )}
      </legend>
      <div className="border-border-light w-[327px] border-b-1 pb-4 lg:w-full">
        {type === "textarea" ? (
          <TextAreaInput
            name={name}
            placeholder={placeholder}
            rules={rules}
            textareaClassName={textareaClassName}
            wrapperClassName={wrapperClassName}
          />
        ) : (
          <TextInput name={name} placeholder={placeholder} rules={rules} wrapperClassName={wrapperClassName} />
        )}
      </div>
    </fieldset>
  );
};
