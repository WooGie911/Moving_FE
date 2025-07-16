/**
 * 지역 enum을 한글로 매핑하는 유틸리티 함수
 */
export const regionLabelMap: Record<string, string> = {
  SEOUL: "서울",
  GYEONGGI: "경기",
  INCHEON: "인천",
  GANGWON: "강원",
  CHUNGBUK: "충북",
  CHUNGNAM: "충남",
  SEJONG: "세종",
  DAEJEON: "대전",
  JEONBUK: "전북",
  JEONNAM: "전남",
  BUSAN: "부산",
  DAEGU: "대구",
  GWANGJU: "광주",
  ULSAN: "울산",
  GYEONGBUK: "경북",
  GYEONGNAM: "경남",
  JEJU: "제주",
};

/**
 * 지역 코드를 한글 이름으로 변환하는 함수
 * @param regionCode - 지역 코드 (SEOUL)
 * @returns 한글 지역명 (서울)
 */
export const getRegionLabel = (regionCode: string): string => {
  return regionLabelMap[regionCode] || regionCode;
};

/**
 * 모든 지역 옵션을 드롭다운용으로 반환하는 함수
 * @returns 드롭다운 옵션 배열
 */
export const getRegionOptions = () => {
  return Object.entries(regionLabelMap).map(([value, label]) => ({
    value,
    label,
  }));
};

/**
 * 기사님 목록 정렬 옵션
 */
export const SORT_OPTIONS = [
  { value: "review", label: "리뷰 많은순" },
  { value: "rating", label: "평점 높은 순" },
  { value: "career", label: "경력 높은 순" },
  { value: "confirmed", label: "확정 많은순" },
];
