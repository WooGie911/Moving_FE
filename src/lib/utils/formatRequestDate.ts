import { useTranslations } from "next-intl";

// 견적신청일: 다국어 날짜 포맷
export const formatRequestDate = (dateStr: string) => {
  const t = useTranslations("estimateRequest");
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 다국어 날짜 포맷
  const yearSuffix = t("dateFormat.year");
  const monthSuffix = t("dateFormat.month");
  const daySuffix = t("dateFormat.day");

  // 영어인 경우 MM/DD/YYYY 형식
  if (monthSuffix === "/" && yearSuffix === "" && daySuffix === "") {
    return `${month}/${day}/${year}`;
  }
  // 한국어, 중국어인 경우 YYYY년 MM월 DD일 형식
  else {
    return `${year}${yearSuffix} ${month}${monthSuffix} ${day}${daySuffix}`;
  }
};
