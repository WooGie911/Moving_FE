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

// 상대적 시간 표시 함수 (기존 버전 - 하위 호환성)
export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return "방금 전";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}분 전`;
  } else if (diffInHours < 24) {
    return `${diffInHours}시간 전`;
  } else if (diffInDays < 7) {
    return `${diffInDays}일 전`;
  } else {
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  }
};

// 다국어 지원 상대적 시간 표시 함수
export const formatRelativeTimeWithTranslations = (
  date: Date,
  translations?: {
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
  },
  locale: string = "ko-KR",
): string => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  // 기본값 설정 (하위 호환성)
  const defaultTranslations = {
    justNow: "방금 전",
    minutesAgo: "분 전",
    hoursAgo: "시간 전",
    daysAgo: "일 전",
  };

  const t = translations || defaultTranslations;

  if (diffInMinutes < 1) {
    return t.justNow;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}${t.minutesAgo}`;
  } else if (diffInHours < 24) {
    return `${diffInHours}${t.hoursAgo}`;
  } else if (diffInDays < 7) {
    return `${diffInDays}${t.daysAgo}`;
  } else {
    return date.toLocaleDateString(locale, { month: "short", day: "numeric" });
  }
};

export function formatDateDot(date: Date | string) {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateWithDayAndTime(
  date: Date | string,
  weekdays?: string[],
  timeFormat?: { am: string; pm: string },
) {
  const d = new Date(date);

  // 기본값 설정 (하위 호환성을 위해)
  const defaultWeekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const defaultTimeFormat = { am: "오전", pm: "오후" };

  const days = weekdays || defaultWeekdays;
  const timeFormatObj = timeFormat || defaultTimeFormat;

  const day = days[d.getDay()];
  let hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  const ampm = hour < 12 ? timeFormatObj.am : timeFormatObj.pm;
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}(${day}) ${ampm} ${hour}:${minute}`;
}
