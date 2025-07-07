export type PaginationSize = "sm" | "lg";

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  size?: PaginationSize;
  className?: string;
} 