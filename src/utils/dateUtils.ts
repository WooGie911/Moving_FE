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

// 상대적 시간 표시 함수
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

export function formatDateDot(date: Date | string) {
  const d = new Date(date);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export function formatDateWithDayAndTime(date: Date | string) {
  const d = new Date(date);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  const day = days[d.getDay()];
  let hour = d.getHours();
  const minute = String(d.getMinutes()).padStart(2, "0");
  const ampm = hour < 12 ? "오전" : "오후";
  if (hour === 0) hour = 12;
  else if (hour > 12) hour -= 12;
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}(${day}) ${ampm} ${hour}:${minute}`;
}
