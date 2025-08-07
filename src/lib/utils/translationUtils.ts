// 서비스 타입 번역 함수
export const getServiceTypeTranslation = (serviceName: string, t: any): string => {
  // 서비스 타입 매핑
  const serviceTypeMap: Record<string, string> = {
    소형이사: "small",
    가정이사: "home",
    사무실이사: "office",
    "Small Move": "small",
    "Home Move": "home",
    "Office Move": "office",
    小型: "small",
    家庭: "home",
    办公室: "office",
  };

  // 매핑된 키가 있으면 사용
  const translationKey = serviceTypeMap[serviceName];
  if (translationKey) {
    const translated = t(translationKey);
    // 영어인 경우 "Move" 추가
    if (translated && (translated === "Small" || translated === "Home" || translated === "Office")) {
      return translated + " Move";
    }
    return translated || serviceName;
  }

  // 직접 번역 시도
  return t(serviceName) || serviceName;
};

// 지역명 번역 함수
export const getRegionTranslation = (regionCode: string, t: any): string => {
  return t(regionCode) || regionCode;
};

// 모바일용 지역명 번역 함수
export const getRegionTranslationMobile = (regionCode: string, t: any): string => {
  return t(`regionsMobile.${regionCode}`) || regionCode;
};
