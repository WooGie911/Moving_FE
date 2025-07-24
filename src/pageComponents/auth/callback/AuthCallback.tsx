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

  return <div>로그인 처리 중...</div>;
}
