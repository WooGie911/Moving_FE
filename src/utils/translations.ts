import ko from "@/messages/ko.json";
import en from "@/messages/en.json";
import zh from "@/messages/zh.json";

export type Language = "ko" | "en" | "zh";

export const translations = {
  ko,
  en,
  zh,
} as const;

export const loadTranslations = (language: Language) => {
  return translations[language];
};

export const getTranslation = (language: Language, key: string, params?: Record<string, string | number>) => {
  const translation = translations[language];
  const keys = key.split(".");

  let result: any = translation;
  for (const k of keys) {
    if (result && typeof result === "object" && k in result) {
      result = result[k];
    } else {
      return key; // 키가 없으면 원본 키 반환
    }
  }

  if (typeof result === "string" && params) {
    // {{key}} 치환
    Object.entries(params).forEach(([k, v]) => {
      result = result.replace(new RegExp(`{{${k}}}`, "g"), String(v));
    });
  }

  return typeof result === "string" ? result : key;
};
