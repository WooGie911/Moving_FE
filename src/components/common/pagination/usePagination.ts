import { useMemo } from "react";

export function usePagination(current: number, total: number, size: "sm" | "lg" = "sm") {
  const DOTS = "...";
  const siblingCount = 1;
  const totalPageNumbers = 2 * siblingCount + 3;

  return useMemo(() => {
    if (total <= 1) return [];

    const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // sm 사이즈
    if (size === "sm") {
      if (total <= 3) {
        return range(1, total);
      }
      if (total <= 10) {
        if (current <= 3) {
          return [1, 2, 3, DOTS, total];
        } else if (current >= total - 2) {
          return [1, DOTS, ...range(total - 2, total)];
        } else {
          return [1, DOTS, current, DOTS, total];
        }
      }

      const leftSibling = Math.max(current - siblingCount, 1);
      const rightSibling = Math.min(current + siblingCount, total);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < total - 1;

      const pages: (number | string)[] = [];

      if (!showLeftDots && showRightDots) {
        pages.push(...range(1, 4), DOTS, total);
      } else if (showLeftDots && !showRightDots) {
        pages.push(1, DOTS, ...range(total - 3, total));
      } else if (showLeftDots && showRightDots) {
        pages.push(1, DOTS, ...range(current - 1, current + 1), DOTS, total);
      } else {
        pages.push(...range(1, total));
      }

      return pages;
    }

    // lg 사이즈
    if (size === "lg") {
      if (total <= 7) {
        return range(1, total);
      }
      if (total <= 10) {
        if (current <= 5) {
          return [...range(1, 5), DOTS, total];
        } else if (current >= total - 4) {
          return [1, DOTS, ...range(total - 4, total)];
        } else {
          return [1, DOTS, ...range(current - 1, current + 1), DOTS, total];
        }
      }

      const leftSibling = Math.max(current - siblingCount, 1);
      const rightSibling = Math.min(current + siblingCount, total);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < total - 1;

      const pages: (number | string)[] = [];

      if (!showLeftDots && showRightDots) {
        pages.push(...range(1, 5), DOTS, total);
      } else if (showLeftDots && !showRightDots) {
        pages.push(1, DOTS, ...range(total - 4, total));
      } else if (showLeftDots && showRightDots) {
        pages.push(1, DOTS, ...range(current - 1, current + 1), DOTS, total);
      } else {
        pages.push(...range(1, total));
      }

      return pages;
    }

    return range(1, total);
  }, [current, total, size]);
}
