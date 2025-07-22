// 백엔드 API 응답 구조에 맞는 타입 정의
export interface IRequestQuoteProps {
  movingType: "home" | "office" | "small" | "document";
  requestDate: string;
  movingDate: string;
  startPoint: string;
  endPoint: string;
}

// 서비스 타입 정의
export type TServiceType = {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
};

// 주소 타입 (백엔드와 일치)
export type TAddress = {
  postalCode: string;
  city: string;
  district: string;
  detail: string | null;
  region: string;
};

// 기사님 정보 타입 (백엔드와 일치)
export type TMoverInfo = {
  id: string;
  name: string;
  userType: string[];
  moverImage: string | null;
  nickname: string | null;
  isVeteran: boolean | null;
  shortIntro: string | null;
  detailIntro: string | null;
  career: number | null;
  workedCount: number | null;
  averageRating: number | null;
  totalReviewCount: number | null;
  serviceTypes: any;
  serviceAreas: any;
  isFavorite: boolean;
};

// 견적서 응답 타입 (백엔드와 일치)
export type TEstimateResponse = {
  id: string;
  price: number;
  comment: string | null;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  mover: TMoverInfo;
};

// 견적 요청 응답 타입 (백엔드와 일치)
export type TEstimateRequestResponse = {
  id: string;
  customerId: string;
  moveType: string;
  moveDate: Date;
  createdAt: Date;
  description: string | null;
  status: string;
  fromAddress: TAddress;
  toAddress: TAddress;
};

// 진행중인 견적 응답 타입 (백엔드와 일치)
export type TPendingQuoteResponse = {
  estimateRequest: TEstimateRequestResponse;
  estimates: TEstimateResponse[];
};

// 완료된 견적 응답 타입 (백엔드와 일치)
export type TReceivedQuoteResponse = {
  estimateRequest: TEstimateRequestResponse;
  estimates: TEstimateResponse[];
};

// 견적 상세 조회 응답 타입 (백엔드와 일치)
export type TQuoteDetailResponse = {
  id: string;
  price: number;
  comment: string | null;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  mover: TMoverInfo;
};

// 견적 확정 요청 타입
export interface IConfirmEstimateRequest {
  estimateId: string;
}

// 지정 견적 요청 타입
export interface IDesignateQuoteRequest {
  message: string;
  moverId: string;
}

// 견적 확정 응답 타입 (백엔드와 일치)
export type TConfirmEstimateResponse = {
  estimateRequest: any;
  estimate: any;
};

// 지정 견적 요청 응답 타입 (백엔드와 일치)
export type TDesignateEstimateRequest = any;

// 이용 내역 응답 타입 (백엔드와 일치)
export type TQuoteHistoryResponse = {
  id: string;
  moveType: string;
  moveDate: Date;
  fromAddress: TAddress;
  toAddress: TAddress;
  description: string | null;
  status: string;
  confirmedEstimate: {
    id: string;
    price: number;
    comment: string | null;
    mover: TMoverInfo;
  };
  completedAt: Date;
};

// 완료된 견적 목록을 위한 타입 (배열)
export type TReceivedQuoteListResponse = TReceivedQuoteResponse[];

// 기존 타입들 (호환성 유지)
export interface ICardListProps {
  isDesignated: boolean;
  estimateId: string;
  estimateState: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
  estimateTitle: string;
  estimatePrice: number;
  mover: TMoverInfo;
  type: "pending" | "received";
}

export interface IDetailPageMainSeactionProps {
  estimateRequest: TEstimateRequestResponse;
  estimate: TEstimateResponse;
  type: "pending" | "received";
}

// 기존 인터페이스들 (호환성을 위해 유지)
export interface IQuote {
  id: string;
  movingType: "SMALL" | "HOME" | "OFFICE";
  movingDate: Date;
  createdAt: Date;
  departureAddr: string;
  arrivalAddr: string;
  arrivalDetail: string | null;
  departureDetail: string | null;
  status: string;
  confirmedEstimateId: string | null;
  estimateCount: number;
  designatedEstimateCount: number;
  serviceTypes?: TServiceType[];
}

export interface IEstimate {
  id: string;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: TMoverInfo;
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
  id: string;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: TMoverInfo;
}

// IPendingQuoteResponse 예시 데이터 (백엔드 구조에 맞게 수정)
export const mockPendingQuoteResponses: TPendingQuoteResponse = {
  estimateRequest: {
    id: "1",
    customerId: "user1",
    moveType: "HOME",
    moveDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    description: "1인가구 이사로 가벼운 짐만 있습니다.",
    status: "PENDING",
    fromAddress: {
      postalCode: "06123",
      city: "서울특별시",
      district: "강남구",
      detail: "테헤란로 123",
      region: "강남구",
    },
    toAddress: {
      postalCode: "06621",
      city: "서울특별시",
      district: "서초구",
      detail: "서초대로 456",
      region: "서초구",
    },
  },
  estimates: [
    {
      id: "101",
      price: 150000,
      comment: "안전하고 신속한 이사 서비스 제공합니다. 포장부터 설치까지 완벽하게 도와드립니다.",
      status: "PROPOSED",
      isDesignated: true,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      mover: {
        id: "mover1",
        name: "김이사",
        userType: ["MOVER"],
        moverImage: null,
        nickname: "김이사",
        isVeteran: false,
        shortIntro: "5년 경력의 전문 이사업체입니다.",
        detailIntro: "신중하고 안전한 이사 서비스",
        career: 5,
        workedCount: 2,
        averageRating: 4.8,
        totalReviewCount: 1,
        serviceTypes: ["HOME", "SMALL"],
        serviceAreas: ["서울특별시"],
        isFavorite: false,
      },
    },
    {
      id: "102",
      price: 180000,
      comment: "고급 포장재 사용으로 안전한 운송을 보장합니다.",
      status: "PROPOSED",
      isDesignated: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      mover: {
        id: "mover2",
        name: "박이사",
        userType: ["MOVER"],
        moverImage: null,
        nickname: "박이사",
        isVeteran: true,
        shortIntro: "8년 경력의 전문 이사업체입니다.",
        detailIntro: "고급 포장재 사용 전문",
        career: 8,
        workedCount: 200,
        averageRating: 4.9,
        totalReviewCount: 78,
        serviceTypes: ["HOME", "OFFICE"],
        serviceAreas: ["서울특별시"],
        isFavorite: false,
      },
    },
  ],
};

// TReceivedQuoteListResponse 예시 데이터 (백엔드 구조에 맞게 수정)
export const mockReceivedQuoteListResponses: TReceivedQuoteListResponse = [
  // 1번 견적 요청 (3개 견적)
  {
    estimateRequest: {
      id: "101",
      customerId: "user1",
      moveType: "HOME",
      moveDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
      description: "1인가구 이사로 가벼운 짐만 있습니다.",
      status: "COMPLETED",
      fromAddress: {
        postalCode: "06123",
        city: "서울특별시",
        district: "강남구",
        detail: "테헤란로 123",
        region: "강남구",
      },
      toAddress: {
        postalCode: "06621",
        city: "서울특별시",
        district: "서초구",
        detail: "서초대로 456",
        region: "서초구",
      },
    },
    estimates: [
      {
        id: "1001",
        price: 150000,
        comment: "안전하고 신속한 이사 서비스 제공합니다. 포장부터 설치까지 완벽하게 도와드립니다.",
        status: "ACCEPTED",
        isDesignated: true,
        createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover1",
          name: "김이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "김이사",
          isVeteran: true,
          shortIntro: "5년 경력의 전문 이사업체입니다.",
          detailIntro: "신중하고 안전한 이사 서비스",
          career: 5,
          workedCount: 125,
          averageRating: 4.8,
          totalReviewCount: 46,
          serviceTypes: ["HOME", "SMALL"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "1002",
        price: 160000,
        comment: "포장이사 전문, 빠르고 안전하게 이사 도와드립니다.",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 17 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover2",
          name: "박이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "박이사",
          isVeteran: false,
          shortIntro: "포장이사 전문업체",
          detailIntro: "빠르고 안전한 이사",
          career: 3,
          workedCount: 2,
          averageRating: 4.5,
          totalReviewCount: 2,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "1003",
        price: 170000,
        comment: "친절한 서비스와 합리적인 가격 보장!",
        status: "REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover3",
          name: "최이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "최이사",
          isVeteran: false,
          shortIntro: "친절한 서비스",
          detailIntro: "합리적인 가격 보장",
          career: 7,
          workedCount: 1,
          averageRating: 4.7,
          totalReviewCount: 1,
          serviceTypes: ["HOME", "OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
    ],
  },
  // 2번 견적 요청 (5개 견적)
  {
    estimateRequest: {
      id: "102",
      customerId: "user2",
      moveType: "OFFICE",
      moveDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
      description: "사무실 이사, 책상 10개, 의자 10개, 복사기 2대.",
      status: "COMPLETED",
      fromAddress: {
        postalCode: "04040",
        city: "서울특별시",
        district: "마포구",
        detail: "와우산로 789",
        region: "마포구",
      },
      toAddress: {
        postalCode: "04763",
        city: "서울특별시",
        district: "성동구",
        detail: "왕십리로 321",
        region: "성동구",
      },
    },
    estimates: [
      {
        id: "2001",
        price: 300000,
        comment: "사무실 이사 전문, 빠르고 안전하게!",
        status: "ACCEPTED",
        isDesignated: true,
        createdAt: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover4",
          name: "이이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "이이사",
          isVeteran: true,
          shortIntro: "사무실 이사 전문",
          detailIntro: "빠르고 안전한 이사",
          career: 10,
          workedCount: 200,
          averageRating: 4.9,
          totalReviewCount: 100,
          serviceTypes: ["OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "2002",
        price: 320000,
        comment: "복사기 운송 전문, 안전하게 운반해드립니다.",
        status: " AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover5",
          name: "정이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "정이사",
          isVeteran: false,
          shortIntro: "복사기 운송 전문",
          detailIntro: "안전한 운반",
          career: 2,
          workedCount: 30,
          averageRating: 4.3,
          totalReviewCount: 10,
          serviceTypes: ["OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "2003",
        price: 310000,
        comment: "책상, 의자 등 사무용품 전문 운송.",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover6",
          name: "오이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "오이사",
          isVeteran: true,
          shortIntro: "사무용품 전문 운송",
          detailIntro: "책상, 의자 등 전문",
          career: 8,
          workedCount: 150,
          averageRating: 4.6,
          totalReviewCount: 60,
          serviceTypes: ["OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "2004",
        price: 330000,
        comment: "사무실 이사, 저렴한 가격 보장!",
        status: "REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover7",
          name: "박이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "박이사",
          isVeteran: false,
          shortIntro: "저렴한 가격 보장",
          detailIntro: "사무실 이사",
          career: 4,
          workedCount: 80,
          averageRating: 4.4,
          totalReviewCount: 25,
          serviceTypes: ["OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "2005",
        price: 340000,
        comment: "사무실 이사, 친절한 서비스!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover8",
          name: "최이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "최이사",
          isVeteran: true,
          shortIntro: "친절한 서비스",
          detailIntro: "사무실 이사",
          career: 6,
          workedCount: 110,
          averageRating: 4.7,
          totalReviewCount: 40,
          serviceTypes: ["OFFICE"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
    ],
  },
  // 3번 견적 요청 (2개 견적)
  {
    estimateRequest: {
      id: "103",
      customerId: "user3",
      moveType: "SMALL",
      moveDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
      description: "소형 이사, 박스 5개, 의자 1개.",
      status: "COMPLETED",
      fromAddress: {
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 456",
        region: "강남구",
      },
      toAddress: {
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 789",
        region: "서초구",
      },
    },
    estimates: [
      {
        id: "3001",
        price: 80000,
        comment: "소형 이사 전문, 저렴한 가격!",
        status: "ACCEPTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover9",
          name: "유이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "유이사",
          isVeteran: false,
          shortIntro: "소형 이사 전문",
          detailIntro: "저렴한 가격",
          career: 2,
          workedCount: 20,
          averageRating: 4.2,
          totalReviewCount: 8,
          serviceTypes: ["SMALL"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "3002",
        price: 90000,
        comment: "빠른 이사, 친절한 서비스!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover10",
          name: "임이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "임이사",
          isVeteran: false,
          shortIntro: "빠른 이사",
          detailIntro: "친절한 서비스",
          career: 1,
          workedCount: 10,
          averageRating: 4.0,
          totalReviewCount: 3,
          serviceTypes: ["SMALL"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
    ],
  },
  // 4번 견적 요청 (6개 견적)
  {
    estimateRequest: {
      id: "104",
      customerId: "user4",
      moveType: "HOME",
      moveDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      description: "가정 이사, 가구 5개, 박스 10개.",
      status: "COMPLETED",
      fromAddress: {
        postalCode: "06123",
        city: "서울특별시",
        district: "강남구",
        detail: "테헤란로 123",
        region: "강남구",
      },
      toAddress: {
        postalCode: "06621",
        city: "서울특별시",
        district: "서초구",
        detail: "서초대로 456",
        region: "서초구",
      },
    },
    estimates: [
      {
        id: "4001",
        price: 200000,
        comment: "가정 이사 전문, 꼼꼼한 포장!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover11",
          name: "신이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "신이사",
          isVeteran: true,
          shortIntro: "가정 이사 전문",
          detailIntro: "꼼꼼한 포장",
          career: 9,
          workedCount: 180,
          averageRating: 4.8,
          totalReviewCount: 70,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "4002",
        price: 210000,
        comment: "친절한 서비스, 안전한 운송!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover12",
          name: "문이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "문이사",
          isVeteran: false,
          shortIntro: "친절한 서비스",
          detailIntro: "안전한 운송",
          career: 3,
          workedCount: 40,
          averageRating: 4.4,
          totalReviewCount: 15,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "4003",
        price: 220000,
        comment: "가구 운송 전문, 빠른 이사!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover13",
          name: "강이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "강이사",
          isVeteran: true,
          shortIntro: "가구 운송 전문",
          detailIntro: "빠른 이사",
          career: 5,
          workedCount: 90,
          averageRating: 4.6,
          totalReviewCount: 35,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "4004",
        price: 230000,
        comment: "저렴한 가격, 최고의 서비스!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover14",
          name: "조이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "조이사",
          isVeteran: false,
          shortIntro: "저렴한 가격",
          detailIntro: "최고의 서비스",
          career: 2,
          workedCount: 25,
          averageRating: 4.2,
          totalReviewCount: 10,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "4005",
        price: 240000,
        comment: "가정 이사, 빠르고 안전하게!",
        status: "AUTO_REJECTED",
        isDesignated: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover15",
          name: "하이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "하이사",
          isVeteran: true,
          shortIntro: "빠르고 안전하게",
          detailIntro: "가정 이사",
          career: 12,
          workedCount: 250,
          averageRating: 4.9,
          totalReviewCount: 120,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
      {
        id: "4006",
        price: 250000,
        comment: "가정 이사, 프리미엄 서비스!",
        status: "AUTO_REJECTED",
        isDesignated: false,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        mover: {
          id: "mover16",
          name: "백이사",
          userType: ["MOVER"],
          moverImage: null,
          nickname: "백이사",
          isVeteran: false,
          shortIntro: "프리미엄 서비스",
          detailIntro: "가정 이사",
          career: 4,
          workedCount: 60,
          averageRating: 4.5,
          totalReviewCount: 22,
          serviceTypes: ["HOME"],
          serviceAreas: ["서울특별시"],
          isFavorite: false,
        },
      },
    ],
  },
];
