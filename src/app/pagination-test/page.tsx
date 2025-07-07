"use client";

import React, { useState } from "react";
import Pagination from "@/components/common/Pagination";
import { useMemo } from "react";

export function usePagination(current: number, total: number, size: "sm" | "lg" = "sm") {
  const DOTS = "...";
  const siblingCount = 1;
  const totalPageNumbers = 2 * siblingCount + 3; // 5

  return useMemo(() => {
    if (total <= 1) return [];

    const range = (start: number, end: number) =>
      Array.from({ length: end - start + 1 }, (_, i) => start + i);

    // sm 사이즈: 5 이하면 모두 보여줌
    if (size === "sm") {
      if (total <= 5) {
        return range(1, total);
      }

      const leftSibling = Math.max(current - siblingCount, 1);
      const rightSibling = Math.min(current + siblingCount, total);

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < total - 1;

      const pages: (number | string)[] = [];

      if (!showLeftDots && showRightDots) {
        // 앞에만 연속, 뒤에 ... 마지막
        pages.push(...range(1, 4), DOTS, total);
      } else if (showLeftDots && !showRightDots) {
        // 앞에 1, ..., 뒤에 연속
        pages.push(1, DOTS, ...range(total - 3, total));
      } else if (showLeftDots && showRightDots) {
        // 앞에 1, ..., 중간, ..., 마지막
        pages.push(1, DOTS, ...range(current - 1, current + 1), DOTS, total);
      } else {
        pages.push(...range(1, total));
      }

      return pages;
    }

    // lg 사이즈는 기존 로직 유지
    if (total <= totalPageNumbers) {
      return range(1, total);
    }

    const leftSibling = Math.max(current - siblingCount, 1);
    const rightSibling = Math.min(current + siblingCount, total);

    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < total - 1;

    const pages: (number | string)[] = [];

    if (!showLeftDots && showRightDots) {
      pages.push(...range(1, totalPageNumbers - 1), DOTS, total);
    } else if (showLeftDots && !showRightDots) {
      pages.push(1, DOTS, ...range(total - (totalPageNumbers - 2), total));
    } else if (showLeftDots && showRightDots) {
      pages.push(1, DOTS, ...range(leftSibling, rightSibling), DOTS, total);
    } else {
      pages.push(...range(1, total));
    }

    return pages;
  }, [current, total, size]);
}

export default function PaginationTestPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);
  const [size, setSize] = useState<"sm" | "lg">("sm");

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pagination 컴포넌트 테스트</h1>
        <div className="mb-4 text-gray-700">
          <span className="font-semibold">현재 아이콘 크기: </span>
          {size === "sm" ? "34x34px" : "48x48px"}
        </div>
        {/* 컨트롤 패널 */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">설정</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                현재 페이지: {currentPage}
              </label>
              <input
                type="range"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전체 페이지: {totalPages}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={totalPages}
                onChange={(e) => setTotalPages(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                사이즈
              </label>
              <select
                value={size}
                onChange={(e) => setSize(e.target.value as "sm" | "lg")}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="sm">Small (sm, 34x34px)</option>
                <option value="lg">Large (lg, 48x48px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pagination 테스트 */}
        <div className="bg-white p-8 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Pagination 컴포넌트</h2>
          <div className="space-y-8">
            {/* 기본 Pagination */}
            <div>
              <h3 className="text-lg font-medium mb-4">기본 Pagination</h3>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                size={size}
              />
            </div>
            {/* 다양한 페이지 수 테스트 */}
            <div>
              <h3 className="text-lg font-medium mb-4">다양한 페이지 수 테스트</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">3페이지</p>
                  <Pagination
                    currentPage={1}
                    totalPages={3}
                    onPageChange={() => {}}
                    size={size}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">5페이지</p>
                  <Pagination
                    currentPage={3}
                    totalPages={5}
                    onPageChange={() => {}}
                    size={size}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">10페이지 (중간)</p>
                  <Pagination
                    currentPage={5}
                    totalPages={10}
                    onPageChange={() => {}}
                    size={size}
                  />
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">15페이지 (끝)</p>
                  <Pagination
                    currentPage={15}
                    totalPages={15}
                    onPageChange={() => {}}
                    size={size}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 현재 상태 표시 */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">현재 상태</h3>
          <p className="text-blue-800">
            현재 페이지: {currentPage} / 전체 페이지: {totalPages} / 사이즈: {size}
          </p>
        </div>
      </div>
    </div>
  );
} 