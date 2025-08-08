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

// 중국어 지역명을 영어 코드로 매핑
const chineseToEnglishRegionMap: Record<string, string> = {
  首尔: "SEOUL",
  京畿: "GYEONGGI",
  仁川: "INCHEON",
  江原: "GANGWON",
  忠北: "CHUNGBUK",
  忠南: "CHUNGNAM",
  世宗: "SEJONG",
  大田: "DAEJEON",
  全北: "JEONBUK",
  全南: "JEONNAM",
  釜山: "BUSAN",
  大邱: "DAEGU",
  光州: "GWANGJU",
  蔚山: "ULSAN",
  庆北: "GYEONGBUK",
  庆南: "GYEONGNAM",
  济州: "JEJU",
  // 추가 중국어 변형들
  姜原: "GANGWON",
  钟布克: "CHUNGBUK",
  中南: "CHUNGNAM",
  广州市: "GWANGJU",
};

// 지역명 번역 함수
export const getRegionTranslation = (regionCode: string, t: any): string => {
  // regions. 접두사가 있으면 제거
  const cleanRegionCode = regionCode.replace("regions.", "");

  // 중국어 지역명인지 확인하고 영어 코드로 변환
  const englishCode = chineseToEnglishRegionMap[cleanRegionCode];
  if (englishCode) {
    return t(englishCode) || cleanRegionCode;
  }

  // 이미 영어 코드인 경우 그대로 사용
  return t(cleanRegionCode) || cleanRegionCode;
};

// 모바일용 지역명 번역 함수
export const getRegionTranslationMobile = (regionCode: string, t: any): string => {
  return t(`regionsMobile.${regionCode}`) || regionCode;
};
