"use client";

import React from "react";
import { useRouter } from "next/navigation";

const NotFound = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-6 text-center">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">페이지를 찾을 수 없습니다</h2>
          <p className="text-gray-500">요청하신 페이지가 존재하지 않거나 이동되었습니다.</p>
        </div>

        <button
          onClick={handleGoBack}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-6 py-3 text-base font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          aria-label="이전 페이지로 돌아가기"
        >
          ← 이전 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
};

export default NotFound;
