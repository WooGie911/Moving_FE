"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "next-intl";
import { initializeLanguagePreference, syncLanguageSettings } from "@/utils/languageUtils";

interface LanguageInitializerProps {
  children: React.ReactNode;
}

export function LanguageInitializer({ children }: LanguageInitializerProps) {
  const locale = useLocale();
  const hasInitialized = useRef(false);

  // 앱 최초 1회: 선호 언어 초기화만 수행 (리다이렉트 없음)
  useEffect(() => {
    if (hasInitialized.current) return;
    initializeLanguagePreference();
    hasInitialized.current = true;
  }, []);

  // 로케일 변화 시 저장소/쿠키 동기화만 수행
  useEffect(() => {
    if (!hasInitialized.current) return;
    syncLanguageSettings();
  }, [locale]);

  return <>{children}</>;
}
