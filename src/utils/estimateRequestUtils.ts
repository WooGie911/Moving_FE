import { formatDateByLanguage } from "./dateUtils";
import { shortenRegionInAddress } from "./regionMapping";

// 이사 종류 라벨 변환 함수
export const getMoveTypeLabel = (moveType: string, t: (key: string) => string): string => {
  switch (moveType) {
    case "HOME":
      return t("estimateRequest.movingTypes.home");
    case "OFFICE":
      return t("estimateRequest.movingTypes.office");
    case "SMALL":
      return t("estimateRequest.movingTypes.small");
    default:
      return moveType;
  }
};

// 이사 종류 텍스트 변환 함수 (소문자 기준)
export const getMovingTypeText = (type: string, t: (key: string) => string): string => {
  switch (type.toLowerCase()) {
    case "small":
      return t("small");
    case "home":
      return t("home");
    case "office":
      return t("office");
    default:
      return type;
  }
};

// 주소 표시 문자열 생성 함수
export const createAddressDisplay = (address: string, detailAddress: string | null): string => {
  return `${shortenRegionInAddress(address)}${detailAddress ? ` ${detailAddress}` : ""}`;
};

// 복합 주소 생성 함수 (region + city + district)
export const createComplexAddressDisplay = (
  region: string,
  city: string,
  district: string,
  detail: string | null,
): string => {
  const baseAddress = `${shortenRegionInAddress(region)} ${city} ${district}`;
  return detail ? `${baseAddress} ${detail}` : baseAddress;
};

// 날짜 포맷팅 함수 (locale 기반)
export const formatDateByLocale = (date?: Date | string, locale: string = "ko"): string => {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;

  // locale에 따른 적절한 로케일 설정
  let localeCode = "ko-KR";
  if (locale === "en") localeCode = "en-US";
  else if (locale === "zh") localeCode = "zh-CN";
  else if (locale === "ko") localeCode = "ko-KR";

  return d.toLocaleDateString(localeCode, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  });
};

// 답변 텍스트 생성 함수
export const createAnswerText = (
  step: number,
  pendingAnswer: string | undefined,
  t: (key: string) => string,
  language: "ko" | "en" | "zh",
): string => {
  if (!pendingAnswer) return "";

  if (step === 1) {
    return `${t(`estimateRequest.movingTypes.${pendingAnswer}`)} (${t(`estimateRequest.movingTypes.${pendingAnswer}Desc`)})`;
  } else if (step === 2) {
    return formatDateByLanguage(pendingAnswer, language);
  }
  return pendingAnswer;
};
