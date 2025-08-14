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
        "flex min-w-0 cursor-pointer items-center justify-center rounded bg-white transition-colors",
        size === "sm" ? "h-8 w-8 text-sm" : "h-12 w-12 text-lg",
        isArrow
          ? isRightArrow
            ? disabled
              ? "text-[#C4C4C4]"
              : "text-black"
            : disabled
              ? "text-[#C4C4C4]"
              : "text-black"
          : active
            ? "font-bold text-black"
            : "text-[#C4C4C4]",
        disabled && "cursor-not-allowed opacity-50",
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
