import React from "react";
import type { TPaginationSize } from "@/types/pagination";

interface IPaginationEllipsisProps {
  size?: TPaginationSize;
}

export default function PaginationEllipsis({ size = "sm" }: IPaginationEllipsisProps) {
  return (
    <span className={size === "sm" ? "mx-1 text-sm" : "mx-2 text-lg"}>...</span>
  );
} 