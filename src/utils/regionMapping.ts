// 지역명 줄이기 매핑
const regionMapping: Record<string, string> = {
  서울특별시: "서울",
  부산광역시: "부산",
  대구광역시: "대구",
  인천광역시: "인천",
  광주광역시: "광주",
  대전광역시: "대전",
  울산광역시: "울산",
  세종특별자치시: "세종",
  충청북도: "충북",
  충청남도: "충남",
  전라북도: "전북",
  전라남도: "전남",
  경상북도: "경북",
  경상남도: "경남",
  강원도: "강원",
  제주특별자치도: "제주",
  경기도: "경기",
  SEOUL: "서울",
  BUSAN: "부산",
  DAEGU: "대구",
  INCHEON: "인천",
  GWANGJU: "광주",
  DAEJEON: "대전",
  ULSAN: "울산",
  SEJONG: "세종",
  GYEONGGI: "경기",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  JEONBUK: "전북",
  JEONNAM: "전남",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
};

/**
 * 지역명을 줄여서 반환하는 함수
 * @param fullAddress 전체 주소 문자열
 * @returns 줄인 지역명이 포함된 주소
 */
export const shortenRegionName = (fullAddress: string): string => {
  let shortenedAddress = fullAddress;

  for (const [fullName, shortName] of Object.entries(regionMapping)) {
    if (shortenedAddress.includes(fullName)) {
      shortenedAddress = shortenedAddress.replace(fullName, shortName);
      break; // 첫 번째 매칭되는 것만 변경
    }
  }

  return shortenedAddress;
};

/**
 * 주소에서 시/도 부분만 줄여서 반환하는 함수
 * @param fullAddress 전체 주소 문자열
 * @returns 시/도 부분만 줄인 주소
 */
export const shortenRegionInAddress = (fullAddress: string): string => {
  // 영어 지역명을 한글로 변환
  let convertedAddress = fullAddress;

  // 영어 지역명 매핑
  const englishRegionMapping: Record<string, string> = {
    SEOUL: "서울",
    BUSAN: "부산",
    DAEGU: "대구",
    INCHEON: "인천",
    GWANGJU: "광주",
    DAEJEON: "대전",
    ULSAN: "울산",
    SEJONG: "세종",
    GYEONGGI: "경기",
    GANGWON: "강원",
    CHUNGBUK: "충북",
    CHUNGNAM: "충남",
    JEONBUK: "전북",
    JEONNAM: "전남",
    GYEONGBUK: "경북",
    GYEONGNAM: "경남",
    JEJU: "제주",
  };

  // 영어 지역명을 한글로 변환
  for (const [english, korean] of Object.entries(englishRegionMapping)) {
    if (convertedAddress.includes(english)) {
      convertedAddress = convertedAddress.replace(english, korean);
      break;
    }
  }

  const parts = convertedAddress.split(" ");

  if (parts.length >= 2) {
    const region = parts[0]; // 첫 번째 부분이 시/도
    const district = parts[1]; // 두 번째 부분이 구/군

    const shortenedRegion = regionMapping[region] || region;

    return `${shortenedRegion} ${district}`;
  }

  return convertedAddress;
};
