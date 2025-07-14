// 날짜 포맷 유틸리티 함수
export const formatDateByLanguage = (dateString: string, language: "ko" | "en" | "zh"): string => {
  if (!dateString) return "";
  let locale = "ko-KR";
  let options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" };

  if (language === "en") {
    locale = "en-US";
    options = { year: "numeric", month: "long", day: "numeric" };
  } else if (language === "zh") {
    locale = "zh-CN";
    options = { year: "numeric", month: "long", day: "numeric" };
  }

  return new Date(dateString).toLocaleDateString(locale, options);
};
