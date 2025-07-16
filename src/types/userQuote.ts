// 백엔드 API 응답 구조에 맞는 타입 정의
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
  profileImage?: string | null;
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

// 백엔드 API 응답 타입들
export interface IQuote {
  id: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  createdAt: Date;
  departureAddr: string;
  arrivalAddr: string;
  departureDetail: string | null;
  status: string;
  confirmedEstimateId: number | null;
  estimateCount: number;
  designatedEstimateCount: number;
}

export interface IEstimate {
  id: number;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: {
    id: number;
    name: string;
    currentRole: string;
    profile: {
      nickname: string;
      profileImage: string | null;
      experience: number;
      introduction: string;
      description: string;
      completedCount: number;
      avgRating: number;
      reviewCount: number;
      favoriteCount: number;
    } | null;
  };
}

export interface IPendingQuoteResponse {
  quote: IQuote;
  estimates: IEstimate[];
}

export interface IReceivedQuoteResponse {
  quote: IQuote;
  estimates: IEstimate[];
}

export interface IQuoteDetailResponse {
  id: number;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: {
    id: number;
    name: string;
    currentRole: string;
    profile: {
      nickname: string;
      profileImage: string | null;
      experience: number;
      introduction: string;
      description: string;
      completedCount: number;
      avgRating: number;
      reviewCount: number;
      favoriteCount: number;
    } | null;
  };
}

export interface IConfirmEstimateRequest {
  estimateId: number;
}

export interface IDesignateQuoteRequest {
  message: string;
  moverId: number;
}

export interface IQuoteHistoryResponse {
  id: number;
  movingType: "SMALL" | "HOME" | "OFFICE";
  movingDate: Date;
  departureAddr: string;
  arrivalAddr: string;
  status: "COMPLETED";
  confirmedEstimate: {
    id: number;
    price: number;
    description: string;
    mover: {
      id: number;
      name: string;
      profile: {
        nickname: string;
        profileImage?: string;
        experience: number;
        avgRating: number;
        reviewCount: number;
      };
    };
  };
  completedAt: Date;
}

// 기존 타입들 (호환성 유지)
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
