// 언어 설정 관련 유틸리티 함수들

const LANGUAGE_PREFERENCE_KEY = "user_language_preference";

/**
 * 쿠키에 언어 설정 저장
 */
export const setLanguagePreference = (language: string, days: number = 365): void => {
  if (typeof window === "undefined") return;

  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${LANGUAGE_PREFERENCE_KEY}=${language};expires=${expires.toUTCString()};path=/`;
};

/**
 * 쿠키에서 언어 설정 읽기
 */
export const getLanguagePreference = (): string | null => {
  if (typeof window === "undefined") return null;

  const nameEQ = LANGUAGE_PREFERENCE_KEY + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

/**
 * 언어 설정 삭제
 */
export const clearLanguagePreference = (): void => {
  if (typeof window === "undefined") return;

  document.cookie = `${LANGUAGE_PREFERENCE_KEY}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
};

/**
 * 유효한 언어인지 확인
 */
export const isValidLanguage = (language: string): boolean => {
  const validLanguages = ["ko", "en", "zh"];
  return validLanguages.includes(language);
};

/**
 * 브라우저 언어 감지
 */
export const detectBrowserLanguage = (): string => {
  if (typeof window === "undefined") return "ko";

  const browserLang = navigator.language || navigator.languages?.[0] || "ko";
  const langCode = browserLang.split("-")[0];

  if (isValidLanguage(langCode)) {
    return langCode;
  }

  return "ko"; // 기본값
};

/**
 * 언어 설정 초기화 (저장된 설정이 없으면 브라우저 언어 사용)
 * 한 번만 실행되도록 안전장치 추가
 */
let isInitialized = false;
export const initializeLanguagePreference = (): string => {
  if (isInitialized) {
    return getLanguagePreference() || "ko";
  }

  const savedLanguage = getLanguagePreference();

  if (savedLanguage && isValidLanguage(savedLanguage)) {
    isInitialized = true;
    return savedLanguage;
  }

  const browserLanguage = detectBrowserLanguage();
  setLanguagePreference(browserLanguage);
  isInitialized = true;
  return browserLanguage;
};

/**
 * 언어 설정 리셋 (테스트용)
 */
export const resetLanguageInitialization = (): void => {
  isInitialized = false;
};
