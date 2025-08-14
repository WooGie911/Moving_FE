import React from "react";
import Image from "next/image";
import clearIcon from "@/assets/icon/etc/icon-x.svg";

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
    `;

  const renderInput = () => {
    return (
      <div className="relative flex h-full items-center">
        {icon && iconPosition === "left" && (
          <div className="absolute left-4 flex h-full items-center justify-center">
            <div className="h-6 w-6 text-gray-400">{icon}</div>
          </div>
        )}
        <input
          className={`h-full w-full rounded-2xl ${icon && iconPosition === "left" ? "pl-12" : ""} ${inputStyle} ${inputClassName}`}
          autoComplete="off"
          {...rest}
        />
        {onClear && rest.value && (
          <div
            className={`absolute ${icon && iconPosition === "right" ? "right-10" : "right-2"} flex h-full items-center`}
          >
            <Image src={clearIcon} alt="clearIcon" className="h-6 w-6 cursor-pointer text-gray-400" onClick={onClear} />
          </div>
        )}
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 flex h-full items-center justify-center">
            <div className="h-6 w-6 text-gray-400">{icon}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`mb-4 h-[54px] w-[327px] ${wrapperClassName}`}>
      {renderInput()}
      {error && (
        <p
          className={`text-state-error mt-1 h-[16px] text-sm text-[13px] sm:h-[34px] sm:text-[16px] ${errorClassName}`}
        >
          {error}
        </p>
      )}
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
  return (
    <div className={`mb-4 h-full ${wrapperClassName}`}>
      <div className="relative">
        <textarea
          className={`h-[160px] w-[327px] resize-none rounded-2xl px-3 py-2 transition outline-none ${error ? "!border-state-error" : "border-gray-200"} ${textareaClassName}`}
          {...rest}
        />
      </div>
      {error && (
        <p
          className={`text-state-error mt-1 h-[26px] text-sm text-[13px] sm:h-[30px] sm:text-[16px] ${errorClassName}`}
        >
          {error}
        </p>
      )}
    </div>
  );
};
