"use client";

import { useEffect } from "react";
import { useLanguageStore } from "@/stores/languageStore";

export default function LanguageSync({ locale }: { locale: string }) {
  const { language, setLanguage } = useLanguageStore();

  useEffect(() => {
    if (locale && language !== locale) {
      setLanguage(locale as any);
    }
  }, [locale, language, setLanguage]);

  return null;
}
