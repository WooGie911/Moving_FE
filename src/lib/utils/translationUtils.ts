// 서비스 타입 번역 함수
export const getServiceTypeTranslation = (serviceName: string, t: any): string => {
  if (serviceName === "소형이사" || serviceName === "SMALL") {
    return t("serviceTypes.small");
  } else if (serviceName === "가정이사" || serviceName === "HOME") {
    return t("serviceTypes.home");
  } else if (serviceName === "사무실이사" || serviceName === "OFFICE") {
    return t("serviceTypes.office");
  }
  return serviceName;
};

// 지역명 번역 함수
export const getRegionTranslation = (regionCode: string, t: any): string => {
  return t(`regions.${regionCode}`) || regionCode;
};

// 모바일용 지역명 번역 함수
export const getRegionTranslationMobile = (regionCode: string, t: any): string => {
  return t(`regionsMobile.${regionCode}`) || regionCode;
};
