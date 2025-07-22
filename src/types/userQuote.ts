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
  estimateState: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SENT";
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
        isVeteran: true,
        shortIntro: "5년 경력의 전문 이사업체입니다.",
        detailIntro: "신중하고 안전한 이사 서비스",
        career: 5,
        workedCount: 120,
        averageRating: 4.8,
        totalReviewCount: 45,
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
  {
    estimateRequest: {
      id: "101",
      customerId: "user1",
      moveType: "HOME",
      moveDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15일 전
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20일 전
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
    ],
  },
];
