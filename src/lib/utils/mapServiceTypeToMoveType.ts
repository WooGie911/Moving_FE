// 서비스 타입 코드를 MoveTypeLabel 타입으로 매핑하는 함수
export const mapServiceTypeToMoveType = (serviceCode: string): "small" | "home" | "office" | "document" => {
  if (!serviceCode) return "small";

  const upperCode = serviceCode.toUpperCase();

  // 영문 대문자 코드 처리
  switch (upperCode) {
    case "SMALL":
      return "small";
    case "HOME":
      return "home";
    case "OFFICE":
      return "office";
    case "DOCUMENT":
      return "document";
  }

  // 중국어 서비스 타입 처리
  if (serviceCode === "主页" || serviceCode === "家庭" || serviceCode === "가정이사" || serviceCode === "Home Move") {
    return "home";
  } else if (serviceCode === "办公室" || serviceCode === "사무실이사" || serviceCode === "Office Move") {
    return "office";
  } else if (serviceCode === "小型" || serviceCode === "소형이사" || serviceCode === "Small Move") {
    return "small";
  } else if (serviceCode === "指定报价" || serviceCode === "지정견적" || serviceCode === "Designated Quote") {
    return "document";
  }

  // 알 수 없는 서비스 타입의 경우 로그 출력
  console.warn("Unknown service type:", serviceCode, "-> defaulting to small");
  return "small";
};
