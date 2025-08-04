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

  return (
    <BaseInput
      type="text"
      placeholder={placeholder}
      error={error}
      inputClassName={inputClassName}
      errorClassName={errorClassName}
      wrapperClassName={wrapperClassName}
      maxLength={maxLength}
      {...register(name, rules)}
    />
  );
};
