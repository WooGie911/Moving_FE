"use client";

import { BaseInput } from "./BaseInput";
import { useFormContext, get, RegisterOptions } from "react-hook-form";

interface IInputProps {
  name: string;
  placeholder?: string;
  rules?: RegisterOptions;
  inputClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
  maxLength?: number;
}

export const TextInput = ({
  name,
  placeholder,
  rules,
  inputClassName,
  errorClassName,
  wrapperClassName,
  maxLength,
}: IInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name)?.message;

  const inputProps = register(name, rules);
  const isCareer = name === "career";
  return (
    <BaseInput
      type="text"
      placeholder={placeholder}
      error={error}
      inputClassName={inputClassName}
      errorClassName={errorClassName}
      wrapperClassName={wrapperClassName}
      maxLength={maxLength}
      // 숫자만 입력, 두 자리 제한
      onInput={
        isCareer
          ? (e) => {
              const target = e.currentTarget as HTMLInputElement;
              target.value = target.value.replace(/[^\d]/g, "").slice(0, 2);
            }
          : undefined
      }
      {...inputProps}
    />
  );
};
