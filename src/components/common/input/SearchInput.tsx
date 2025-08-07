"use client";

import { BaseInput } from "./BaseInput";
import { useFormContext, get, RegisterOptions, useWatch } from "react-hook-form";
import search from "@/assets/icon/etc/icon-search.svg";
import Image from "next/image";

interface ISearchInputProps {
  name: string;
  placeholder?: string;
  rules?: RegisterOptions;
  iconPosition?: "left" | "right";
  inputClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export const SearchInput = ({
  name,
  placeholder,
  rules,
  iconPosition = "left",
  inputClassName,
  errorClassName,
  wrapperClassName,
}: ISearchInputProps) => {
  const {
    register,
    setValue,
    clearErrors,
    formState: { errors },
    control,
  } = useFormContext();

  const error = get(errors, name)?.message;
  const value = useWatch({ name, control });

  const handleClear = () => {
    setValue(name, "");
    clearErrors(name);
  };

  // wrapperClassName에 w-full이 포함되어 있으면 고정 너비를 사용하지 않음
  const isFullWidth = wrapperClassName?.includes("w-full");
  const defaultWrapperClass = isFullWidth
    ? `h-[52px] sm:h-[64px] ${wrapperClassName}`
    : `w-[260px] h-[52px] sm:w-[560px] sm:h-[64px] ${wrapperClassName}`;

  return (
    <BaseInput
      type="search"
      placeholder={placeholder}
      error={error}
      onClear={handleClear}
      icon={<Image src={search} alt="검색" className="h-6 w-6" />}
      iconPosition={iconPosition}
      inputClassName={inputClassName}
      errorClassName={errorClassName}
      wrapperClassName={defaultWrapperClass}
      value={value ?? ""}
      {...register(name, rules)}
    />
  );
};
