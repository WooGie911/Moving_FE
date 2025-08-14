// movingType을 번역 키로 변환하는 함수
export const getMovingTypeKey = (movingType: string): string => {
  switch (movingType) {
    case "small":
      return "small";
    case "office":
      return "office";
    case "home":
      return "home";
    case "document":
      return "document";
    default:
      return movingType;
  }
};
