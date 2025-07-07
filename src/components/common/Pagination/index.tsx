import React from "react";
import type { PaginationProps } from "./types";
import { usePagination } from "./usePagination";
import PaginationButton from "./PaginationButton";
import PaginationEllipsis from "./PaginationEllipsis";

import IconLeft from "@/assets/icon/arrow/icon-left-pn.png";
import IconLeftBlack from "@/assets/icon/arrow/icon-left-pn-black.png";
import IconRight from "@/assets/icon/arrow/icon-right-pn.png";
import IconRightBlack from "@/assets/icon/arrow/icon-right-pn-black.png";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  size = "sm",
  className = "",
}: PaginationProps) {
  const pages = usePagination(currentPage, totalPages, size);

  if (totalPages <= 1) return null;

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const leftActiveIcon = IconLeftBlack;
  const rightActiveIcon = IconRightBlack;
  const leftInactiveIcon = IconLeft;
  const rightInactiveIcon = IconRight;

  const iconSizeClass = size === "lg" ? "w-12 h-12" : "w-[34px] h-[34px]";
  const navSizeClass = size === "lg" ? "w-[476px] h-12" : "w-[270px] h-[34px]";

  return (
    <nav className={`flex justify-center items-center gap-1 ${navSizeClass} ${className}`} aria-label="pagination">
      <PaginationButton
        size={size}
        disabled={isPrevDisabled}
        onClick={() => onPageChange(currentPage - 1)}
        isArrow
      >
        <img
          src={isPrevDisabled ? leftInactiveIcon.src : leftActiveIcon.src}
          alt="이전"
          className={iconSizeClass}
        />
      </PaginationButton>
      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <PaginationButton
            key={page}
            size={size}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </PaginationButton>
        ) : (
          <PaginationEllipsis key={`ellipsis-${idx}`} size={size} />
        )
      )}
      <PaginationButton
        size={size}
        disabled={isNextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        isArrow
        isRightArrow
      >
        <img
          src={isNextDisabled ? rightInactiveIcon.src : rightActiveIcon.src}
          alt="다음"
          className={iconSizeClass}
        />
      </PaginationButton>
    </nav>
  );
} 