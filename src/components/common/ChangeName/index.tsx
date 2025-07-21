import React from "react";
import type { IPaginationProps } from "@/types/pagination";

import leftActiveIcon from "@/assets/icon/arrow/icon-left-pn-black.png";
import leftInactiveIcon from "@/assets/icon/arrow/icon-left-pn.png";
import rightActiveIcon from "@/assets/icon/arrow/icon-right-pn-black.png";
import rightInactiveIcon from "@/assets/icon/arrow/icon-right-pn.png";
import Image from "next/image";
import { usePagination } from "./usePagination";
import PaginationButton from "./PaginationButton";
import PaginationEllipsis from "./PaginationEllipsis";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  size = "sm",
  className = "",
}: IPaginationProps) {
  const pages = usePagination(currentPage, totalPages, size);

  if (totalPages <= 1) return null;

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  const iconSizeClass = size === "lg" ? "w-12 h-12" : "w-[34px] h-[34px]";
  const navSizeClass = size === "lg" ? "w-[476px] h-12" : "w-[270px] h-[34px]";

  return (
    <nav className={`flex items-center justify-center gap-1 ${navSizeClass} ${className}`} aria-label="pagination">
      <PaginationButton size={size} disabled={isPrevDisabled} onClick={() => onPageChange(currentPage - 1)} isArrow>
        <Image
          src={isPrevDisabled ? leftInactiveIcon : leftActiveIcon}
          alt="이전"
          width={size === "lg" ? 48 : 34}
          height={size === "lg" ? 48 : 34}
          className={iconSizeClass}
        />
      </PaginationButton>
      {pages.map((page, idx) =>
        typeof page === "number" ? (
          <PaginationButton key={page} size={size} active={page === currentPage} onClick={() => onPageChange(page)}>
            {page}
          </PaginationButton>
        ) : (
          <PaginationEllipsis key={`ellipsis-${idx}`} size={size} />
        ),
      )}
      <PaginationButton
        size={size}
        disabled={isNextDisabled}
        onClick={() => onPageChange(currentPage + 1)}
        isArrow
        isRightArrow
      >
        <Image
          src={isNextDisabled ? rightInactiveIcon : rightActiveIcon}
          alt="다음"
          width={size === "lg" ? 48 : 34}
          height={size === "lg" ? 48 : 34}
          className={iconSizeClass}
        />
      </PaginationButton>
    </nav>
  );
}
