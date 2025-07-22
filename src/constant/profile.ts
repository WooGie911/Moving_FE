export const SERVICE_OPTIONS = ["소형이사", "가정이사", "사무실이사"];
export const REGION_OPTIONS = [
  "서울",
  "경기",
  "인천",
  "강원",
  "충북",
  "충남",
  "세종",
  "대전",
  "전북",
  "전남",
  "광주",
  "경북",
  "경남",
  "대구",
  "울산",
  "부산",
  "제주",
];

// 서비스 옵션 매핑 - 새로운 API 스펙에 맞게 문자열로 변경
export const SERVICE_MAPPING = {
  소형이사: "SMALL",
  가정이사: "HOME",
  사무실이사: "OFFICE",
} as const;

// 지역 영어 매핑
export const REGION_MAPPING = {
  서울: "SEOUL",
  경기: "GYEONGGI",
  인천: "INCHEON",
  강원: "GANGWON",
  충북: "CHUNGBUK",
  충남: "CHUNGNAM",
  세종: "SEJONG",
  대전: "DAEJEON",
  전북: "JEONBUK",
  전남: "JEONNAM",
  광주: "GWANGJU",
  경북: "GYEONGBUK",
  경남: "GYEONGNAM",
  대구: "DAEGU",
  울산: "ULSAN",
  부산: "BUSAN",
  제주: "JEJU",
} as const;
