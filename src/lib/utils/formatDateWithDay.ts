import { useTranslations } from "next-intl";

// 이사일: 다국어 날짜 포맷
export const formatDateWithDay = (dateStr: Date) => {
  const t = useTranslations("estimateRequest");
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = [
    t("weekdays.sunday"),
    t("weekdays.monday"),
    t("weekdays.tuesday"),
    t("weekdays.wednesday"),
    t("weekdays.thursday"),
    t("weekdays.friday"),
    t("weekdays.saturday"),
  ];
  const dayOfWeek = weekdays[date.getDay()];

  // 다국어 날짜 포맷 - 언어별로 다른 형식 적용
  const yearSuffix = t("dateFormat.year");
  const monthSuffix = t("dateFormat.month");
  const daySuffix = t("dateFormat.day");

  // 영어인 경우 MM/DD/YYYY 형식
  if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
    return `${month}/${day}/${year} (${dayOfWeek})`;
  }
  // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
  else {
    return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix} (${dayOfWeek})`;
  }
};
