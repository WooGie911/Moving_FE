"use client";

import { BaseInput } from "./BaseInput";
import { useFormContext, get, RegisterOptions } from "react-hook-form";
import Image from "next/image";
import visibilityOn from "@/assets/icon/etc/icon-visibility-on.png";
import visibilityOff from "@/assets/icon/etc/icon-visibility-off.png";
import { useState } from "react";

interface IInputProps {
  name: string;
  placeholder?: string;
  rules?: RegisterOptions;
  inputClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export const PasswordInput = ({
  name,
  placeholder,
  rules,
  inputClassName,
  errorClassName,
  wrapperClassName,
}: IInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = get(errors, name)?.message;
  const [visible, setVisible] = useState(false);

  const toggleIcon = (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setVisible(!visible);
      }}
      className="flex h-6 w-6 items-center justify-center"
      aria-label={!visible ? "비밀번호 숨기기" : "비밀번호 보이기"}
    >
      <Image
        src={!visible ? visibilityOff : visibilityOn}
        alt={!visible ? "비밀번호 숨기기" : "비밀번호 보이기"}
        className="h-6 w-6 object-cover"
      />
    </button>
  );

  return (
    <BaseInput
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      icon={toggleIcon}
      iconPosition="right"
      inputClassName={inputClassName}
      errorClassName={errorClassName}
      wrapperClassName={wrapperClassName}
      {...register(name, rules)}
    />
  );
};
