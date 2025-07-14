export interface IQuoteProps {
  movingType: string;
  requestDate: string;
  movingDate: string;
  startPoint: string;
  endPoint: string;
}

export type TProfile = {
  id: number;
  userId: number;
  nickname: string;
  profileImage?: string | undefined | "";
  experience?: number; // 경력
  introduction: string;
  completedCount: number; // 완료된 이사 건수
  avgRating: number; // 평균 평점
  reviewCount: number; // 리뷰 총 개수
  favoriteCount: number; // 찜한 사용자 수
  description: string;
};

export type TMover = {
  id: number;
  email: string;
  name: String;
  currentRole: "CUSTOMER" | "MOVER";
  profile: TProfile;
};

export interface ICardListProps {
  movingType: "small" | "home" | "office" | "document";
  isDesignated: boolean;
  estimateId: string;
  estimateState: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SENT";
  estimateTitle: string;
  estimatePrice: number;
  mover: TMover;
  type: "pending" | "received";
}

export const profile1: TProfile = {
  id: 1,
  userId: 1,
  nickname: "김코드",
  profileImage: "",
  experience: 10,
  introduction: "안녕하세요, 김코드입니다.",
  completedCount: 99,
  avgRating: 4.8,
  reviewCount: 46,
  favoriteCount: 33,
  description: "안녕하세요, 김코드입니다.",
};
export const mover1: TMover = {
  id: 1,
  email: "test@test.com",
  name: "김코드",
  currentRole: "MOVER",
  profile: profile1,
};

export const mockestimateList: ICardListProps[] = [
  {
    movingType: "small",
    isDesignated: true,
    estimateId: "12",
    estimateState: "ACCEPTED",
    estimateTitle: "확정된 견적 목데이터 입니다",
    estimatePrice: 130000,
    mover: mover1,
    type: "received",
  },

  {
    movingType: "small",
    isDesignated: true,
    estimateId: "13",
    estimateState: "PENDING",
    estimateTitle: "확정이 아닌 대기중인 견적 1",
    estimatePrice: 150000,
    mover: mover1,
    type: "received",
  },
  {
    movingType: "small",
    isDesignated: false,
    estimateId: "14",
    estimateState: "PENDING",
    estimateTitle: "확정이 아닌 지정도 아닌 대기중인 견적 1",
    estimatePrice: 160000,
    mover: mover1,
    type: "received",
  },
  {
    movingType: "small",
    isDesignated: false,
    estimateId: "15",
    estimateState: "PENDING",
    estimateTitle: "확정이 아닌 지정도 아닌 대기중인 견적 2",
    estimatePrice: 180000,
    mover: mover1,
    type: "received",
  },
];
export const QuoteInfo1: IQuoteProps = {
  movingType: "small",
  requestDate: "2025년 6월 24일",
  movingDate: "2025년 7월 8일(화)",
  startPoint: "서울시 중랑구 능동로 21길",
  endPoint: "경기도 수원시 팔달구 팔달로 123길",
};
