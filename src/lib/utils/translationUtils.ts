// 서비스 타입 번역 함수
export const getServiceTypeTranslation = (serviceName: string, t: any): string => {
  // 서비스 타입 매핑
  const serviceTypeMap: Record<string, string> = {
    소형이사: "service.small",
    가정이사: "service.home",
    사무실이사: "service.office",
    "Small Move": "service.small",
    "Home Move": "service.home",
    "Office Move": "service.office",
    小型: "service.small",
    家庭: "service.home",
    办公室: "service.office",
  };

  // 매핑된 키가 있으면 사용, 없으면 원본 반환
  const translationKey = serviceTypeMap[serviceName];
  if (translationKey) {
    return t(translationKey) || serviceName;
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
