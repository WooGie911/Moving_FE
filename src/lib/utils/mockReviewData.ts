const maskName = (fullName: string): string => {
  if (!fullName || fullName.length === 0) return "익명";
  const firstName = fullName.charAt(0);
  const restLength = fullName.length - 1;
  if (restLength <= 0) return firstName;
  const maskedPart = "*".repeat(restLength);
  return firstName + maskedPart;
};

export const generateMockReviews = (moverId: string, count: number = 50): any[] => {
  const customerNames = [
    "김철수",
    "이영희",
    "박민수",
    "정수진",
    "최동욱",
    "한미영",
    "송태호",
    "윤서연",
    "임재현",
    "강지은",
    "조현우",
    "백소영",
    "남기준",
    "오혜진",
    "신동현",
  ];

  const contents = [
    "정말 친절하고 꼼꼼하게 작업해주셔서 감사했습니다. 다음에도 꼭 이용하고 싶어요!",
    "시간 약속을 잘 지켜주시고, 물건도 안전하게 옮겨주셨습니다. 추천합니다!",
    "가격도 합리적이고 서비스도 훌륭했어요. 특히 포장 작업이 정말 깔끔했습니다.",
    "기사님이 전문적이고 경험이 많으신 것 같아서 믿고 맡길 수 있었습니다.",
    "이사 전날까지 연락 주시고, 당일에도 정확한 시간에 도착해주셔서 좋았습니다.",
    "무거운 가구도 조심스럽게 다뤄주시고, 설치도 완벽하게 해주셨습니다.",
    "가격이 조금 비싸다고 생각했는데, 서비스 품질을 보니 정말 합리적이었어요.",
    "기사님이 친절하게 설명해주시고, 궁금한 점도 잘 답변해주셨습니다.",
    "이사 후 정리도 도와주시고, 쓰레기 처리도 깔끔하게 해주셨습니다.",
    "다음에 이사할 때도 꼭 이 기사님을 찾아서 이용하고 싶어요!",
    "포장재도 미리 준비해주시고, 작업 과정도 투명하게 보여주셨습니다.",
    "가족들이 모두 만족했어요. 특히 아이 방 가구를 조심스럽게 다뤄주셨습니다.",
    "비가 오는 날이었는데도 정말 깔끔하게 작업해주셔서 감사했습니다.",
    "기사님이 경험이 많으셔서 어려운 상황도 잘 해결해주셨습니다.",
    "가격 협상도 합리적으로 해주시고, 서비스 품질도 훌륭했습니다.",
  ];

  const reviews: any[] = [];
  for (let i = 0; i < count; i++) {
    const randomDate = new Date();
    randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 365));
    const fullName = customerNames[Math.floor(Math.random() * customerNames.length)];
    const maskedName = maskName(fullName);
    const userId = Math.floor(Math.random() * 100) + 1;
    const quoteId = Math.floor(Math.random() * 1000) + 1;
    const estimateId = Math.floor(Math.random() * 1000) + 1;
    const id = i + 1;
    const rating = Math.floor(Math.random() * 2) + 4;
    const content = contents[Math.floor(Math.random() * contents.length)];
    const status = "COMPLETED";
    const isPublic = true;
    const createdAt = randomDate.toISOString();
    const updatedAt = createdAt;
    reviews.push({
      id,
      quoteId,
      estimateId,
      userId,
      moverId,
      rating,
      content,
      status,
      isPublic,
      createdAt,
      updatedAt,
      user: {
        id: userId,
        name: maskedName,
      },
    });
  }
  return reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getMockReviewsForMover = (moverId: string): any[] => {
  return generateMockReviews(moverId, 50);
};
