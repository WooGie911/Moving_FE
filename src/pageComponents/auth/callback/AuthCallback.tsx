"use client";

import { setTokensToCookie } from "@/utils/auth";
import { useEffect } from "react";

// /auth/callback 페이지 (보호되지 않음)
export default function AuthCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("accessToken");

    if (accessToken) {
      // 쿠키에 토큰 저장
      setTokensToCookie(accessToken);

      // 적절한 페이지로 리디렉션
      window.location.href = "/profile/register";
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="text-center">
        {/* 파동 애니메이션 */}
        <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
          {/* 중앙 원 */}
          <div className="absolute h-8 w-8 animate-pulse rounded-full bg-[#f9502e]"></div>

          {/* 파동 효과 - 1번째 원 */}
          <div className="absolute h-16 w-16 animate-ping rounded-full border-2 border-[#f9502e] opacity-75"></div>

          {/* 파동 효과 - 2번째 원 */}
          <div
            className="absolute h-24 w-24 animate-ping rounded-full border-2 border-orange-400 opacity-50"
            style={{ animationDelay: "0.5s" }}
          ></div>

          {/* 파동 효과 - 3번째 원 */}
          <div
            className="absolute h-32 w-32 animate-ping rounded-full border-2 border-orange-300 opacity-25"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        {/* 로딩 텍스트 */}
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#f9502e]"></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#f9502e]" style={{ animationDelay: "0.1s" }}></div>
            <div className="h-2 w-2 animate-bounce rounded-full bg-[#f9502e]" style={{ animationDelay: "0.2s" }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
