import React from "react";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import iconEdit from "@/assets/icon/icon-edit.png";

/**
 * props
 * variant: 버튼 타입 (solid, outlined)
 * state: 버튼 상태 (default, disabled, active, done)
 * children: 버튼 내용
 * onClick: 버튼 클릭 시 실행할 함수
 * isEditButton: 수정 버튼 여부
 * className: 버튼 추가 클래스
 * disabled: 버튼 비활성화 여부
 */
type SolidState = "default" | "disabled";
type OutlinedState = "default" | "active" | "done";

type ButtonProps = {
  variant: "solid" | "outlined";
  state: SolidState | OutlinedState;
  children: React.ReactNode;
  onClick?: () => void;
  isEditButton?: boolean;
  className?: string;
  disabled?: boolean;
};

export const Button = ({
  variant,
  state,
  children,
  onClick,
  isEditButton = false,
  className = "",
  disabled = false,
}: ButtonProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)");

  /* Solid */
  const solidBase =
    "flex items-center justify-center text-gray-50 font-semibold transition-colors duration-200 focus:outline-none ";
  const solidSize = isMobile
    ? "h-[54px] w-[327px] text-md rounded-[12px]"
    : "h-[60px] w-[640px] text-lg rounded-[16px]";
  let solidState = "bg-primary-400 hover:bg-primary-500";
  if (state === "disabled" || disabled) solidState = "bg-gray-300 cursor-not-allowed";

  /* Outlined */
  const outlinedBase =
    "flex items-center justify-center border-[1px] text-primary-400 font-semibold transition-colors duration-200 focus:outline-none ";
  const outlinedSize = isMobile
    ? "h-[54px] w-[327px] text-md rounded-[12px]"
    : "h-[60px] w-[640px] text-lg rounded-[16px]";
  let outlinedState = "border-primary-400 text-primary-400 bg-inherit";
  if (state === "active") outlinedState = "border-primary-400 text-primary-400 bg-primary-100";
  if (state === "done") outlinedState = "border-gray-150 text-gray-600! bg-inherit";

  /* 버튼 클래스 조합 */
  const buttonClass =
    variant === "solid"
      ? `${solidBase} ${solidSize} ${solidState} ${className}`
      : `${outlinedBase} ${outlinedSize} ${outlinedState} ${className}`;

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={variant === "solid" ? state === "disabled" || disabled : false}
    >
      {children}
      {/* 수정 아이콘 */}
      {variant === "solid" && isEditButton && (
        <Image src={iconEdit} alt="수정" width={24} height={24} className="ml-2" />
      )}
    </button>
  );
};
