// 날짜 포맷 유틸리티 함수
export const formatDateToKorean = (dateString: string): string => {
  if (!dateString) return "";

  return new Date(dateString).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export const getMovingTypeLabel = (type: string): string => {
  switch (type) {
    case "small":
      return "소형 이사 (원룸, 투룸, 20평대 미만)";
    case "home":
      return "가정 이사 (쓰리룸, 20평대 이상)";
    case "office":
      return "사무실 이사 (사무실, 상업공간)";
    default:
      return "";
  }
};
