// 서비스 타입 코드를 MoveTypeLabel 타입으로 매핑하는 함수
export const mapServiceTypeToMoveType = (serviceCode: string): "small" | "home" | "office" | "document" => {
  switch (serviceCode) {
    case "SMALL":
      return "small";
    case "HOME":
      return "home";
    case "OFFICE":
      return "office";
    default:
      return "home"; // 기본값
  }
};
