import React from "react";
import type { PaginationSize } from "./types";
 
export default function PaginationEllipsis({ size = "sm" }: { size?: PaginationSize }) {
  return (
    <span className={size === "sm" ? "mx-1 text-sm" : "mx-2 text-lg"}>...</span>
  );
} 