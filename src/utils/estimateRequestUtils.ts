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

// 주소 표시 문자열 생성 함수
export const createAddressDisplay = (address: string, detailAddress: string | null): string => {
  return `${shortenRegionInAddress(address)}${detailAddress ? ` ${detailAddress}` : ""}`;
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
