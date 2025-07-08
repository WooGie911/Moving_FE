"use client";

import { BaseTextarea } from "./BaseInput";
import { useFormContext, get, RegisterOptions } from "react-hook-form";

interface IInputProps {
  name: string;
  placeholder?: string;
  rules?: RegisterOptions;
  textareaClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export const TextAreaInput = ({
  name,
  placeholder,
  rules,
  textareaClassName,
  errorClassName,
  wrapperClassName,
}: IInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name)?.message;

  return (
    <BaseTextarea
      placeholder={placeholder}
      error={error}
      textareaClassName={textareaClassName}
      errorClassName={errorClassName}
      wrapperClassName={wrapperClassName}
      {...register(name, rules)}
    />
  );
};
