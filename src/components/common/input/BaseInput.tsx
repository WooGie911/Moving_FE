import React from "react";
import Image from "next/image";
import clearIcon from "@/assets/icon/etc/icon-x.png";

export interface IBaseInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  onClear?: () => void;
  inputClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export interface IBaseTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  textareaClassName?: string;
  errorClassName?: string;
  wrapperClassName?: string;
}

export const BaseInput = ({
  error,
  icon,
  iconPosition = "left",
  onClear,
  inputClassName = "",
  errorClassName = "",
  wrapperClassName = "",
  ...rest
}: IBaseInputProps) => {
  const inputStyle = `w-full border rounded px-3 py-2 outline-none transition
    ${error ? "border-state-error" : "border-gray-200"}
    ${rest.disabled ? "bg-gray-100 cursor-not-allowed" : ""}
    ${icon ? (iconPosition === "left" ? "pl-5" : "pr-5") : ""}
    ${inputClassName}`;

  const defaultWrapperClass = "w-[327px] h-[54px] sm:w-[560px] sm:h-[64px]";
  const defaultErrorClass = "h-[16px] text-[13px] sm:h-[34px] sm:text-[16px]";

  const renderInput = () => {
    return (
      <div className="relative">
        {icon && iconPosition === "left" && <span className="absolute top-2.5 left-4 text-gray-400">{icon}</span>}
        <input className={`rounded-2xl ${icon && iconPosition === "left" ? "pl-12" : ""} ${inputStyle}`} {...rest} />
        {onClear && rest.value && (
          <Image
            src={clearIcon}
            alt="clearIcon"
            className={`absolute top-2.5 ${
              icon && iconPosition === "right" ? "right-10" : "right-2"
            } h-6 w-6 cursor-pointer text-gray-400`}
            onClick={onClear}
          />
        )}
        {icon && iconPosition === "right" && <span className="absolute top-2.5 right-3 text-gray-400">{icon}</span>}
      </div>
    );
  };

  return (
    <div className={`mb-4 ${defaultWrapperClass} ${wrapperClassName}`}>
      {renderInput()}
      {error && <p className={`text-state-error mt-1 text-sm ${defaultErrorClass} ${errorClassName}`}>{error}</p>}
    </div>
  );
};

export const BaseTextarea = ({
  error,
  textareaClassName = "",
  errorClassName = "",
  wrapperClassName = "",
  ...rest
}: IBaseTextareaProps) => {
  const defaultTextareaClass = "w-[327px] h-[160px] sm:w-[560px] sm:h-[160px]";
  const defaultErrorClass = "h-[26px] text-[13px] sm:h-[30px] sm:text-[16px]";

  return (
    <div className={`mb-4 h-full ${wrapperClassName}`}>
      <div className="relative">
        <textarea
          className={`h-full w-full resize-none rounded-2xl border px-3 py-2 transition outline-none ${defaultTextareaClass} ${textareaClassName}`}
          {...rest}
        />
      </div>
      {error && <p className={`text-state-error mt-1 text-sm ${defaultErrorClass} ${errorClassName}`}>{error}</p>}
    </div>
  );
};
