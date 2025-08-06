// 서비스 타입 번역 함수
export const getServiceTypeTranslation = (serviceName: string, t: any): string => {
  // 기존 service 섹션의 번역 사용
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
