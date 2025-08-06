"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { initializeLanguagePreference } from "@/utils/languageUtils";

interface LanguageInitializerProps {
  children: React.ReactNode;
}

export function LanguageInitializer({ children }: LanguageInitializerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 이미 초기화되었거나 루트 경로인 경우 스킵
    if (hasInitialized.current || pathname === "/") {
      return;
    }

    // 앱이 처음 로드될 때만 언어 설정 초기화
    const preferredLanguage = initializeLanguagePreference();

    // 현재 경로에서 locale을 추출
    const currentLocale = pathname.split("/")[1];
    const validLocales = ["ko", "en", "zh"];

    // 현재 locale이 유효하지 않거나 선호 언어와 다르면 리다이렉트
    if (!validLocales.includes(currentLocale) || currentLocale !== preferredLanguage) {
      const newPath = pathname.replace(/^\/(ko|en|zh)/, `/${preferredLanguage}`);
      router.replace(newPath);
    }

    hasInitialized.current = true;
  }, []); // 의존성 배열을 비워서 한 번만 실행

  return <>{children}</>;
}
