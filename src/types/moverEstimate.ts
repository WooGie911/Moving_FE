// 기사님 견적 관련 타입들

// 견적 생성 요청 타입
export interface ICreateEstimateRequest {
  quoteId: number;
  price: number;
  description: string;
}

// 견적 반려 요청 타입
export interface IRejectEstimateRequest {
  quoteId: number;
  description: string;
}

// 견적 조회 필터링 타입
export interface IQuoteFilterOptions {
  availableRegion: string;
  sortBy?: "movingDate" | "createdAt";
  customerName?: string;
  movingType?: "SMALL" | "HOME" | "OFFICE";
}

// 지정 견적 조회 필터링 타입
export interface IDesignatedQuoteFilterOptions {
  sortBy?: "movingDate" | "createdAt";
  customerName?: string;
  movingType?: "SMALL" | "HOME" | "OFFICE";
}

// 견적 상태 업데이트 타입
export interface IUpdateEstimateStatusRequest {
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
}

// 견적서 업데이트 타입
export interface IUpdateEstimateRequest {
  price: number;
  description: string;
}

// 견적 응답 타입
export interface IQuoteResponse {
  id: number;
  userId: number;
  movingType: "SMALL" | "HOME" | "OFFICE" | "DOCUMENT";
  movingDate: Date;
  departureAddr: string;
  arrivalAddr: string;
  departureDetail: string | null;
  arrivalDetail: string | null;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    name: string;
    currentRole: string;
    currentRegion: string | null;
    profile: {
      nickname: string;
      profileImage: string | null;
      introduction: string;
      description: string;
    } | null;
  };
}

// 견적서 응답 타입
export interface IEstimateResponse {
  id: number;
  quoteId: number;
  moverId: number;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SENT" | "MOVER_REJECTED";
  isDesignated: boolean;
  createdAt: Date;
  updatedAt: Date;
  quote?: IQuoteResponse;
}

// 내가 보낸 견적서 응답 타입
export interface IMyEstimateResponse {
  id: number;
  quoteId: number;
  moverId: number;
  price: number;
  description: string;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  updatedAt: Date;
  quote: IQuoteResponse;
}

// 내가 반려한 견적 응답 타입
export interface IMyRejectedQuoteResponse {
  id: number;
  quoteId: number;
  price: number;
  description: string;
  status: string;
  createdAt: Date;
  quote: IQuoteResponse;
}

// 견적 생성 응답 타입
export interface ICreateEstimateResponse {
  id: number;
  quoteId: number;
  moverId: number;
  price: number;
  description: string;
  status: "PENDING";
  createdAt: Date;
}

// 견적 반려 응답 타입
export interface IRejectEstimateResponse {
  id: number;
  quoteId: number;
  moverId: number;
  price: number;
  description: string;
  status: "MOVER_REJECTED";
  createdAt: Date;
}

// 견적 상태 업데이트 응답 타입
export interface IUpdateEstimateStatusResponse {
  id: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  updatedAt: Date;
}

// 견적서 업데이트 응답 타입
export interface IUpdateEstimateResponse {
  id: number;
  price: number;
  description: string;
  updatedAt: Date;
}

// 필터 상태 타입

// 필터 상태 타입
export interface IFilterState {
  movingTypes: string[];
  isDesignatedOnly: boolean;
  isServiceAreaOnly: boolean;
  searchKeyword: string;
  sortBy: "movingDate" | "createdAt";
}

// 견적 응답 예시 데이터
export const mockQuoteResponseData: IQuoteResponse[] = [
  {
    id: 1,
    userId: 101,
    movingType: "HOME",
    movingDate: new Date("2025-07-31"), // 월요일
    departureAddr: "서울특별시 강남구 테헤란로 123",
    arrivalAddr: "서울특별시 서초구 서초대로 456",
    departureDetail: "강남역 1번 출구 근처",
    arrivalDetail: "서초역 3번 출구 앞",
    description: "1인가구 이사로 가벼운 짐만 있습니다. 책상과 의자, 작은 서랍장 정도만 있어요.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5분 전
    updatedAt: new Date(Date.now() - 5 * 60 * 1000),
    user: {
      id: 101,
      name: "김철수",
      currentRole: "USER",
      currentRegion: "서울특별시",
      profile: {
        nickname: "철수",
        profileImage: "https://example.com/profile1.jpg",
        introduction: "안녕하세요! 깔끔하게 이사해주세요.",
        description: "신중하고 꼼꼼한 고객입니다.",
      },
    },
  },
  {
    id: 2,
    userId: 102,
    movingType: "OFFICE",
    movingDate: new Date("2025-07-29"), // 화요일
    departureAddr: "서울특별시 마포구 와우산로 789",
    arrivalAddr: "서울특별시 성동구 왕십리로 321",
    departureDetail: "홍대입구역 2번 출구",
    arrivalDetail: "왕십리역 1번 출구",
    description: "소규모 사무실 이사입니다. 책상 5개, 의자 5개, 서랍장 2개, 복사기 1대 있습니다.",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    user: {
      id: 102,
      name: "이영희",
      currentRole: "USER",
      currentRegion: "서울특별시",
      profile: {
        nickname: "영희",
        profileImage: "https://example.com/profile2.jpg",
        introduction: "사무실 이사 전문입니다.",
        description: "신속하고 안전한 이사를 원합니다.",
      },
    },
  },
  {
    id: 3,
    userId: 103,
    movingType: "SMALL",
    movingDate: new Date("2025-07-27"), // 수요일
    departureAddr: "서울특별시 송파구 올림픽로 654",
    arrivalAddr: "서울특별시 강동구 천호대로 987",
    departureDetail: "잠실역 4번 출구",
    arrivalDetail: "천호역 2번 출구",
    description: "작은 짐만 있습니다. 옷장과 작은 서랍장, 이불 정도만 있어요.",
    status: "REJECTED",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    user: {
      id: 103,
      name: "박민수",
      currentRole: "USER",
      currentRegion: "서울특별시",
      profile: {
        nickname: "민수",
        profileImage: null,
        introduction: "간단한 이사 부탁드립니다.",
        description: "저렴한 가격을 원합니다.",
      },
    },
  },
  {
    id: 4,
    userId: 104,
    movingType: "HOME",
    movingDate: new Date("2025-07-25"), // 목요일
    departureAddr: "서울특별시 종로구 종로 111",
    arrivalAddr: "서울특별시 중구 을지로 222",
    departureDetail: "종로3가역 1번 출구",
    arrivalDetail: "을지로3가역 4번 출구",
    description: "중요한 서류와 문서들만 이사합니다. 특별히 조심해서 다뤄주세요.",
    status: "PENDING",
    createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), // 7일 전
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    user: {
      id: 104,
      name: "최지영",
      currentRole: "USER",
      currentRegion: "서울특별시",
      profile: {
        nickname: "지영",
        profileImage: "https://example.com/profile4.jpg",
        introduction: "문서 이사 전문입니다.",
        description: "신중하고 꼼꼼한 처리를 원합니다.",
      },
    },
  },
  {
    id: 5,
    userId: 105,
    movingType: "HOME",
    movingDate: new Date("2025-07-23"), // 금요일
    departureAddr: "서울특별시 노원구 동일로 333",
    arrivalAddr: "서울특별시 도봉구 도봉로 444",
    departureDetail: "노원역 2번 출구",
    arrivalDetail: "도봉역 1번 출구",
    description: "가족 이사입니다. 가전제품과 가구가 많아서 조심해서 다뤄주세요.",
    status: "CONFIRMED",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10일 전
    updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    user: {
      id: 105,
      name: "정수진",
      currentRole: "USER",
      currentRegion: "서울특별시",
      profile: {
        nickname: "수진",
        profileImage: "https://example.com/profile5.jpg",
        introduction: "가족 이사 경험이 많습니다.",
        description: "안전하고 신중한 이사를 원합니다.",
      },
    },
  },
];

// 내가 보낸 견적서 예시 데이터
export const mockMyEstimateData: IEstimateResponse[] = [
  {
    id: 1,
    quoteId: 101,
    moverId: 201,
    price: 150000,
    description: "안전하고 신속한 이사 서비스 제공합니다. 포장재 포함, 보험 가입 완료.",
    status: "PENDING",
    isDesignated: true,
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30분 전
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    quote: {
      id: 101,
      userId: 101,
      movingType: "HOME",
      movingDate: new Date("2025-07-21"),
      departureAddr: "서울특별시 강남구 테헤란로 123",
      arrivalAddr: "서울특별시 서초구 서초대로 456",
      departureDetail: "강남역 1번 출구 근처",
      arrivalDetail: "서초역 3번 출구 앞",
      description: "1인가구 이사로 가벼운 짐만 있습니다. 책상과 의자, 작은 서랍장 정도만 있어요.",
      status: "PENDING",
      createdAt: new Date("2024-12-10T09:30:00"),
      updatedAt: new Date("2024-12-10T09:30:00"),
      user: {
        id: 101,
        name: "김철수",
        currentRole: "USER",
        currentRegion: "서울특별시",
        profile: {
          nickname: "철수",
          profileImage: "https://example.com/profile1.jpg",
          introduction: "안녕하세요! 깔끔하게 이사해주세요.",
          description: "신중하고 꼼꼼한 고객입니다.",
        },
      },
    },
  },
  {
    id: 2,
    quoteId: 102,
    moverId: 201,
    price: 250000,
    description: "사무실 이사 전문 서비스입니다. 책상, 의자, 서랍장 등 가구류 안전하게 이전해드립니다.",
    status: "ACCEPTED",
    isDesignated: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2시간 전
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1시간 전
    quote: {
      id: 102,
      userId: 102,
      movingType: "OFFICE",
      movingDate: new Date("2025-07-24"),
      departureAddr: "서울특별시 마포구 와우산로 789",
      arrivalAddr: "서울특별시 성동구 왕십리로 321",
      departureDetail: "홍대입구역 2번 출구",
      arrivalDetail: "왕십리역 1번 출구",
      description: "소규모 사무실 이사입니다. 책상 5개, 의자 5개, 서랍장 2개, 복사기 1대 있습니다.",
      status: "CONFIRMED",
      createdAt: new Date("2024-12-08T14:20:00"),
      updatedAt: new Date("2024-12-09T11:15:00"),
      user: {
        id: 102,
        name: "이영희",
        currentRole: "USER",
        currentRegion: "서울특별시",
        profile: {
          nickname: "영희",
          profileImage: "https://example.com/profile2.jpg",
          introduction: "사무실 이사 전문입니다.",
          description: "신속하고 안전한 이사를 원합니다.",
        },
      },
    },
  },
  {
    id: 3,
    quoteId: 103,
    moverId: 201,
    price: 180000,
    description: "작은 짐 이사 서비스입니다. 옷장, 서랍장 등 소형 가구만 있어서 빠르게 처리 가능합니다.",
    status: "REJECTED",
    isDesignated: false,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1일 전
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    quote: {
      id: 103,
      userId: 103,
      movingType: "SMALL",
      movingDate: new Date("2025-07-30"),
      departureAddr: "서울특별시 송파구 올림픽로 654",
      arrivalAddr: "서울특별시 강동구 천호대로 987",
      departureDetail: "잠실역 4번 출구",
      arrivalDetail: "천호역 2번 출구",
      description: "작은 짐만 있습니다. 옷장과 작은 서랍장, 이불 정도만 있어요.",
      status: "REJECTED",
      createdAt: new Date("2024-12-07T16:45:00"),
      updatedAt: new Date("2024-12-08T10:30:00"),
      user: {
        id: 103,
        name: "박민수",
        currentRole: "USER",
        currentRegion: "서울특별시",
        profile: {
          nickname: "민수",
          profileImage: null,
          introduction: "간단한 이사 부탁드립니다.",
          description: "저렴한 가격을 원합니다.",
        },
      },
    },
  },
  {
    id: 4,
    quoteId: 104,
    moverId: 201,
    price: 120000,
    description: "문서 이사 전문 서비스입니다. 중요한 서류들을 안전하게 보관하여 이전해드립니다.",
    status: "EXPIRED",
    isDesignated: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3일 전
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    quote: {
      id: 104,
      userId: 104,
      movingType: "HOME",
      movingDate: new Date("2025-06-25"),
      departureAddr: "서울특별시 종로구 종로 111",
      arrivalAddr: "서울특별시 중구 을지로 222",
      departureDetail: "종로3가역 1번 출구",
      arrivalDetail: "을지로3가역 4번 출구",
      description: "중요한 서류와 문서들만 이사합니다. 특별히 조심해서 다뤄주세요.",
      status: "PENDING",
      createdAt: new Date("2024-12-09T13:10:00"),
      updatedAt: new Date("2024-12-09T13:10:00"),
      user: {
        id: 104,
        name: "최지영",
        currentRole: "USER",
        currentRegion: "서울특별시",
        profile: {
          nickname: "지영",
          profileImage: "https://example.com/profile4.jpg",
          introduction: "문서 이사 전문입니다.",
          description: "신중하고 꼼꼼한 처리를 원합니다.",
        },
      },
    },
  },
  {
    id: 5,
    quoteId: 105,
    moverId: 201,
    price: 300000,
    description: "가족 이사 전문 서비스입니다. 가전제품과 가구를 안전하게 포장하여 이전해드립니다.",
    status: "SENT",
    isDesignated: false,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5일 전
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    quote: {
      id: 105,
      userId: 105,
      movingType: "HOME",
      movingDate: new Date("2025-05-21"),
      departureAddr: "서울특별시 노원구 동일로 333",
      arrivalAddr: "서울특별시 도봉구 도봉로 444",
      departureDetail: "노원역 2번 출구",
      arrivalDetail: "도봉역 1번 출구",
      description: "가족 이사입니다. 가전제품과 가구가 많아서 조심해서 다뤄주세요.",
      status: "CONFIRMED",
      createdAt: new Date("2024-12-06T10:25:00"),
      updatedAt: new Date("2024-12-07T15:40:00"),
      user: {
        id: 105,
        name: "정수진",
        currentRole: "USER",
        currentRegion: "서울특별시",
        profile: {
          nickname: "수진",
          profileImage: "https://example.com/profile5.jpg",
          introduction: "가족 이사 경험이 많습니다.",
          description: "안전하고 신중한 이사를 원합니다.",
        },
      },
    },
  },
];
