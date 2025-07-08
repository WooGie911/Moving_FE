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

  return (
    <BaseInput
      type={visible ? "text" : "password"}
      placeholder={placeholder}
      error={error}
      icon={
        visible ? (
          <Image
            onClick={() => setVisible(false)}
            src={visibilityOff}
            alt="비밀번호 안보이기"
            className="h-6 w-6 cursor-pointer"
          />
        ) : (
          <Image
            onClick={() => setVisible(true)}
            src={visibilityOn}
            alt="비밀번호 보이기"
            className="h-6 w-6 cursor-pointer"
          />
        )
      }
      iconPosition="right"
      inputClassName={inputClassName}
      errorClassName={errorClassName}
      wrapperClassName={wrapperClassName}
      {...register(name, rules)}
    />
  );
};
