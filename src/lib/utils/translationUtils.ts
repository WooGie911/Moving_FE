export const getServiceTypeTranslation = (serviceName: string, t: any) => {
  switch (serviceName) {
    case "소형이사":
      return t("serviceTypes.small");
    case "가정이사":
      return t("serviceTypes.home");
    case "사무실이사":
      return t("serviceTypes.office");
    default:
      return serviceName;
  }
};

export const getRegionTranslation = (region: string, t: any) => {
  return t(`regions.${region}`);
};

export const getServiceTypeForLabel = (serviceName: string) => {
  switch (serviceName) {
    case "소형이사":
      return "small";
    case "가정이사":
      return "home";
    case "사무실이사":
      return "office";
    default:
      return "document";
  }
};

export const getRegionTranslationMobile = (region: string, t: any) => {
  return t(`regionsMobile.${region}`) || t(`regions.${region}`);
};