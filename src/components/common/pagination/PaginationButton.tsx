import React from "react";
import clsx from "clsx";
import type { TPaginationSize } from "@/types/pagination";

interface IPaginationButtonProps {
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  size?: TPaginationSize;
  isArrow?: boolean; 
  isRightArrow?: boolean; 
}

export default function PaginationButton({
  children,
  active,
  disabled,
  onClick,
  size = "sm",
  isArrow = false,
  isRightArrow = false,
}: IPaginationButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "flex items-center justify-center rounded transition-colors bg-white min-w-0",
        size === "sm" ? "w-8 h-8 text-sm" : "w-12 h-12 text-lg",
        isArrow
          ? isRightArrow
            ? disabled
              ? "text-[#C4C4C4]"
              : "text-black"
            : disabled
            ? "text-[#C4C4C4]"
            : "text-black"
          : active
          ? "text-black font-bold"
          : "text-[#C4C4C4]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
} 