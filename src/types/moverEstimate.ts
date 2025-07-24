// 기사님 견적 관련 타입들

// 견적 생성 요청 타입 (백엔드와 일치)
export interface ICreateEstimateRequest {
  estimateRequestId: string;
  moverId: string;
  price: number;
  comment: string;
}

// 견적 반려 요청 타입 (백엔드와 일치)
export interface IRejectEstimateRequest {
  estimateRequestId: string;
  moverId: string;
  comment: string;
}

// 견적 조회 필터링 타입 (백엔드와 일치)
export interface IEstimateRequestFilterOptions {
  sortBy?: "moveDate" | "createdAt";
  customerName?: string;
  movingType?: "SMALL" | "HOME" | "OFFICE";
}

// 지정 견적 조회 필터링 타입 (백엔드와 일치)
export interface IDesignatedEstimateRequestFilterOptions {
  moverId: string;
  sortBy?: "moveDate" | "createdAt";
  customerName?: string;
  movingType?: "SMALL" | "HOME" | "OFFICE";
}

// 견적 상태 업데이트 타입 (백엔드와 일치)
export interface IUpdateEstimateStatusRequest {
  estimateId: string;
  moverId: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
}

// 견적서 업데이트 타입 (백엔드와 일치)
export interface IUpdateEstimateRequest {
  estimateId: string;
  moverId: string;
  price: number;
  comment: string;
}

// 주소 타입 정의 (백엔드와 일치)
export type TAddress = {
  id: string;
  postalCode: string;
  city: string;
  district: string;
  detail: string | null;
  region: string;
};

// 고객 타입 정의 (백엔드와 일치)
export type TCustomer = {
  id: string;
  name: string;
  currentArea: string | null;
  customerImage: string | null;
  nickname: string | null;
};

// 기사님 타입 정의 (백엔드와 일치)
export type TMover = {
  id: string;
  name: string;
  moverImage: string | null;
  nickname: string | null;
  shortIntro: string | null;
  detailIntro: string | null;
  career: number | null;
  workedCount: number | null;
  averageRating: number | null;
  totalReviewCount: number | null;
  serviceTypes: string[];
};

// 견적 요청 응답 타입 (백엔드와 일치)
export type TEstimateRequestResponse = {
  id: string;
  customerId: string;
  moveType: "SMALL" | "HOME" | "OFFICE";
  moveDate: Date;
  fromAddressId: string;
  toAddressId: string;
  description: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  isDesignated?: boolean; // 지정견적 여부 (선택적 필드)
  customer: TCustomer;
  fromAddress: TAddress;
  toAddress: TAddress;
};

// 견적서 응답 타입 (백엔드와 일치)
export type TEstimateResponse = {
  id: string;
  moverId: string;
  estimateRequestId: string;
  price: number | null;
  comment: string | null;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
  rejectReason: string | null;
  isDesignated: boolean;
  workingHours: string | null;
  includesPackaging: boolean;
  insuranceAmount: number | null;
  validUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  mover: TMover;
  estimateRequest: TEstimateRequestResponse;
};

// 내가 보낸 견적서 응답 타입 (백엔드와 일치)
export type TMyEstimateResponse = {
  id: string;
  moverId: string;
  estimateRequestId: string;
  price: number | null;
  comment: string | null;
  status: "PROPOSED" | "ACCEPTED" | "AUTO_REJECTED";
  rejectReason: string | null;
  isDesignated: boolean;
  workingHours: string | null;
  includesPackaging: boolean;
  insuranceAmount: number | null;
  validUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  mover: TMover;
  estimateRequest: TEstimateRequestResponse;
};

// 내가 반려한 견적 응답 타입 (백엔드와 일치)
export type TMyRejectedEstimateResponse = {
  id: string;
  moverId: string;
  estimateRequestId: string;
  price: number | null;
  comment: string | null;
  status: "REJECTED";
  rejectReason: string | null;
  isDesignated: boolean;
  workingHours: string | null;
  includesPackaging: boolean;
  insuranceAmount: number | null;
  validUntil: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  mover: TMover;
  estimateRequest: TEstimateRequestResponse;
};

// 견적 생성 응답 타입 (백엔드와 일치)
export interface ICreateEstimateResponse {
  id: string;
  moverId: string;
  estimateRequestId: string;
  price: number;
  comment: string;
  status: "PROPOSED";
  createdAt: Date;
}

// 견적 반려 응답 타입 (백엔드와 일치)
export interface IRejectEstimateResponse {
  id: string;
  moverId: string;
  estimateRequestId: string;
  price: number | null;
  comment: string;
  status: "REJECTED";
  createdAt: Date;
}

// 견적 상태 업데이트 응답 타입 (백엔드와 일치)
export interface IUpdateEstimateStatusResponse {
  id: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
  updatedAt: Date;
}

// 견적서 업데이트 응답 타입 (백엔드와 일치)
export interface IUpdateEstimateResponse {
  id: string;
  price: number;
  comment: string;
  updatedAt: Date;
}

// 필터 상태 타입
export interface IFilterState {
  movingTypes: string[];
  isDesignatedOnly: boolean;
  isServiceAreaOnly: boolean;
  searchKeyword: string;
  sortBy: "moveDate" | "createdAt";
}

export interface ICardListProps {
  id: string;
  data: TEstimateRequestResponse;
  isDesignated: boolean;
  estimatePrice?: number;
  mover?: TMover;
  type: "received" | "sent" | "rejected";
}

// 견적 응답 예시 데이터 (백엔드 구조에 맞게 수정)
export const mockEstimateRequestResponseData: {
  regionEstimateRequests?: TEstimateRequestResponse[];
  designatedEstimateRequests?: TEstimateRequestResponse[];
} = {
  regionEstimateRequests: [
    {
      id: "1",
      customerId: "customer1",
      moveType: "HOME",
      moveDate: new Date("2025-07-31"),
      fromAddressId: "addr1",
      toAddressId: "addr2",
      description: "1인가구 이사로 가벼운 짐만 있습니다. 책상과 의자, 작은 서랍장 정도만 있어요.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      updatedAt: new Date(Date.now() - 5 * 60 * 1000),
      isDesignated: false,
      customer: {
        id: "customer1",
        name: "김철수",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile1.jpg",
        nickname: "철수",
      },
      fromAddress: {
        id: "addr1",
        postalCode: "06123",
        city: "서울특별시",
        district: "강남구",
        detail: "테헤란로 123",
        region: "강남구",
      },
      toAddress: {
        id: "addr2",
        postalCode: "06621",
        city: "서울특별시",
        district: "서초구",
        detail: "서초대로 456",
        region: "서초구",
      },
    },
    {
      id: "3",
      customerId: "customer3",
      moveType: "SMALL",
      moveDate: new Date("2025-07-25"),
      fromAddressId: "addr5",
      toAddressId: "addr6",
      description: "가벼운 짐만 있는 1인가구 이사입니다. 책상 1개, 의자 1개, 작은 서랍장 1개만 있어요.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isDesignated: false,
      customer: {
        id: "customer3",
        name: "박민수",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile3.jpg",
        nickname: "민수",
      },
      fromAddress: {
        id: "addr5",
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 456",
        region: "강남구",
      },
      toAddress: {
        id: "addr6",
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 789",
        region: "서초구",
      },
    },
    {
      id: "5",
      customerId: "customer5",
      moveType: "OFFICE",
      moveDate: new Date("2025-08-10"),
      fromAddressId: "addr9",
      toAddressId: "addr10",
      description: "중소기업 사무실 이사입니다. 책상 10개, 의자 10개, 서랍장 5개, 복사기 2대, 프린터 1대 있습니다.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isDesignated: false,
      customer: {
        id: "customer5",
        name: "정수민",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile5.jpg",
        nickname: "수민",
      },
      fromAddress: {
        id: "addr9",
        postalCode: "04040",
        city: "서울특별시",
        district: "마포구",
        detail: "와우산로 123",
        region: "마포구",
      },
      toAddress: {
        id: "addr10",
        postalCode: "04763",
        city: "서울특별시",
        district: "성동구",
        detail: "왕십리로 456",
        region: "성동구",
      },
    },
    {
      id: "7",
      customerId: "customer7",
      moveType: "HOME",
      moveDate: new Date("2025-08-20"),
      fromAddressId: "addr13",
      toAddressId: "addr14",
      description: "신혼부부 이사입니다. 가구 2개, 서랍장 1개, 책상 1개, 의자 2개 있습니다.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 7 * 60 * 60 * 1000),
      isDesignated: false,
      customer: {
        id: "customer7",
        name: "박준호",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile7.jpg",
        nickname: "준호",
      },
      fromAddress: {
        id: "addr13",
        postalCode: "04040",
        city: "서울특별시",
        district: "마포구",
        detail: "와우산로 456",
        region: "마포구",
      },
      toAddress: {
        id: "addr14",
        postalCode: "04763",
        city: "서울특별시",
        district: "성동구",
        detail: "왕십리로 789",
        region: "성동구",
      },
    },
  ],
  designatedEstimateRequests: [
    {
      id: "2",
      customerId: "customer2",
      moveType: "OFFICE",
      moveDate: new Date("2025-07-29"),
      fromAddressId: "addr3",
      toAddressId: "addr4",
      description: "소규모 사무실 이사입니다. 책상 5개, 의자 5개, 서랍장 2개, 복사기 1대 있습니다.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isDesignated: true,
      customer: {
        id: "customer2",
        name: "이영희",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile2.jpg",
        nickname: "영희",
      },
      fromAddress: {
        id: "addr3",
        postalCode: "04040",
        city: "서울특별시",
        district: "마포구",
        detail: "와우산로 789",
        region: "마포구",
      },
      toAddress: {
        id: "addr4",
        postalCode: "04763",
        city: "서울특별시",
        district: "성동구",
        detail: "왕십리로 321",
        region: "성동구",
      },
    },
    {
      id: "4",
      customerId: "customer4",
      moveType: "HOME",
      moveDate: new Date("2025-08-05"),
      fromAddressId: "addr7",
      toAddressId: "addr8",
      description: "가족 이사입니다. 가구 3개, 서랍장 2개, 책상 2개, 의자 4개 있습니다.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isDesignated: true,
      customer: {
        id: "customer4",
        name: "최지영",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile4.jpg",
        nickname: "지영",
      },
      fromAddress: {
        id: "addr7",
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 789",
        region: "강남구",
      },
      toAddress: {
        id: "addr8",
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 123",
        region: "서초구",
      },
    },
    {
      id: "6",
      customerId: "customer6",
      moveType: "SMALL",
      moveDate: new Date("2025-08-15"),
      fromAddressId: "addr11",
      toAddressId: "addr12",
      description: "학생 이사입니다. 책상 1개, 의자 1개, 작은 서랍장 1개, 책장 1개만 있어요.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isDesignated: true,
      customer: {
        id: "customer6",
        name: "김현우",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile6.jpg",
        nickname: "현우",
      },
      fromAddress: {
        id: "addr11",
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 321",
        region: "강남구",
      },
      toAddress: {
        id: "addr12",
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 654",
        region: "서초구",
      },
    },
    {
      id: "8",
      customerId: "customer8",
      moveType: "OFFICE",
      moveDate: new Date("2025-08-25"),
      fromAddressId: "addr15",
      toAddressId: "addr16",
      description: "스타트업 사무실 이사입니다. 책상 3개, 의자 3개, 서랍장 1개, 복사기 1대 있습니다.",
      status: "PENDING",
      createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      isDesignated: true,
      customer: {
        id: "customer8",
        name: "이서연",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile8.jpg",
        nickname: "서연",
      },
      fromAddress: {
        id: "addr15",
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 654",
        region: "강남구",
      },
      toAddress: {
        id: "addr16",
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 321",
        region: "서초구",
      },
    },
  ],
};

// 내가 보낸 견적서 예시 데이터 (백엔드 구조에 맞게 수정)
export const mockMyEstimateData: TMyEstimateResponse[] = [
  {
    id: "1",
    moverId: "mover1",
    estimateRequestId: "101",
    price: 150000,
    comment: "안전하고 신속한 이사 서비스 제공합니다. 포장재 포함, 보험 가입 완료.",
    status: "PROPOSED",
    rejectReason: null,
    isDesignated: true,
    workingHours: "09:00-18:00",
    includesPackaging: true,
    insuranceAmount: 1000000,
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    deletedAt: null,
    mover: {
      id: "mover1",
      name: "김이사",
      moverImage: "https://example.com/mover1.jpg",
      nickname: "김이사",
      shortIntro: "5년 경력의 전문 이사업체입니다.",
      detailIntro: "신중하고 안전한 이사 서비스",
      career: 5,
      workedCount: 120,
      averageRating: 4.8,
      totalReviewCount: 45,
      serviceTypes: ["HOME", "SMALL"],
    },
    estimateRequest: {
      id: "101",
      customerId: "customer1",
      moveType: "HOME",
      moveDate: new Date("2025-07-21"),
      fromAddressId: "addr1",
      toAddressId: "addr2",
      description: "1인가구 이사로 가벼운 짐만 있습니다. 책상과 의자, 작은 서랍장 정도만 있어요.",
      status: "PENDING",
      createdAt: new Date("2024-12-10T09:30:00"),
      updatedAt: new Date("2024-12-10T09:30:00"),
      customer: {
        id: "customer1",
        name: "김철수",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile1.jpg",
        nickname: "철수",
      },
      fromAddress: {
        id: "addr1",
        postalCode: "06123",
        city: "서울특별시",
        district: "강남구",
        detail: "테헤란로 123",
        region: "강남구",
      },
      toAddress: {
        id: "addr2",
        postalCode: "06621",
        city: "서울특별시",
        district: "서초구",
        detail: "서초대로 456",
        region: "서초구",
      },
    },
  },
  {
    id: "2",
    moverId: "mover1",
    estimateRequestId: "102",
    price: 200000,
    comment: "사무실 이사 전문 서비스입니다. 책상과 의자, 복사기 등 사무용품 안전 운송 보장.",
    status: "ACCEPTED",
    rejectReason: null,
    isDesignated: true,
    workingHours: "08:00-17:00",
    includesPackaging: true,
    insuranceAmount: 2000000,
    validUntil: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    deletedAt: null,
    mover: {
      id: "mover1",
      name: "김이사",
      moverImage: "https://example.com/mover1.jpg",
      nickname: "김이사",
      shortIntro: "5년 경력의 전문 이사업체입니다.",
      detailIntro: "신중하고 안전한 이사 서비스",
      career: 5,
      workedCount: 125,
      averageRating: 4.8,
      totalReviewCount: 46,
      serviceTypes: ["HOME", "OFFICE"],
    },
    estimateRequest: {
      id: "102",
      customerId: "customer2",
      moveType: "OFFICE",
      moveDate: new Date("2025-07-15"),
      fromAddressId: "addr3",
      toAddressId: "addr4",
      description: "소규모 사무실 이사입니다. 책상 5개, 의자 5개, 서랍장 2개, 복사기 1대 있습니다.",
      status: "COMPLETED",
      createdAt: new Date("2024-12-05T14:20:00"),
      updatedAt: new Date("2024-12-05T14:20:00"),
      customer: {
        id: "customer2",
        name: "이영희",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile2.jpg",
        nickname: "영희",
      },
      fromAddress: {
        id: "addr3",
        postalCode: "04040",
        city: "서울특별시",
        district: "마포구",
        detail: "와우산로 789",
        region: "마포구",
      },
      toAddress: {
        id: "addr4",
        postalCode: "04763",
        city: "서울특별시",
        district: "성동구",
        detail: "왕십리로 321",
        region: "성동구",
      },
    },
  },
];

// 내가 반려한 견적 예시 데이터 (백엔드 구조에 맞게 수정)
export const mockMyRejectedEstimateData: TMyRejectedEstimateResponse[] = [
  {
    id: "3",
    moverId: "mover1",
    estimateRequestId: "103",
    price: null,
    comment: "현재 일정이 맞지 않아 견적을 제출할 수 없습니다.",
    status: "REJECTED",
    rejectReason: "일정 불일치",
    isDesignated: false,
    workingHours: null,
    includesPackaging: false,
    insuranceAmount: null,
    validUntil: null,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    deletedAt: null,
    mover: {
      id: "mover1",
      name: "김이사",
      moverImage: "https://example.com/mover1.jpg",
      nickname: "김이사",
      shortIntro: "5년 경력의 전문 이사업체입니다.",
      detailIntro: "신중하고 안전한 이사 서비스",
      career: 5,
      workedCount: 120,
      averageRating: 4.8,
      totalReviewCount: 45,
      serviceTypes: ["HOME", "SMALL"],
    },
    estimateRequest: {
      id: "103",
      customerId: "customer3",
      moveType: "HOME",
      moveDate: new Date("2025-07-10"),
      fromAddressId: "addr5",
      toAddressId: "addr6",
      description: "가벼운 짐만 있는 1인가구 이사입니다.",
      status: "COMPLETED",
      createdAt: new Date("2024-12-01T10:15:00"),
      updatedAt: new Date("2024-12-01T10:15:00"),
      customer: {
        id: "customer3",
        name: "박민수",
        currentArea: "서울특별시",
        customerImage: "https://example.com/profile3.jpg",
        nickname: "민수",
      },
      fromAddress: {
        id: "addr5",
        postalCode: "06234",
        city: "서울특별시",
        district: "강남구",
        detail: "역삼로 456",
        region: "강남구",
      },
      toAddress: {
        id: "addr6",
        postalCode: "06772",
        city: "서울특별시",
        district: "서초구",
        detail: "반포대로 789",
        region: "서초구",
      },
    },
  },
];

// 기존 인터페이스들 (호환성을 위해 유지)
export interface IEstimateRequestResponse {
  id: string;
  userId: string;
  movingType: "SMALL" | "HOME" | "OFFICE";
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
    id: string;
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

export interface IEstimateResponse {
  id: string;
  estimateRequestsId: string;
  moverId: string;
  price: number | null;
  description: string;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  updatedAt: Date;
  estimateRequest?: IEstimateRequestResponse;
}

export interface IServiceType {
  id: number;
  name: string;
  description: string | null;
  iconUrl: string | null;
}

export interface IProfile {
  nickname: string;
  profileImage: string | null;
  introduction: string;
  description: string;
  experience: number;
  completedCount: number;
  avgRating: number;
  reviewCount: number;
  favoriteCount: number;
  serviceTypes: {
    service: IServiceType;
  }[];
}

export interface IMyEstimateResponse {
  id: string;
  estimateRequestId: string;
  moverId: string;
  price: number | null;
  description: string;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  updatedAt: Date;
  EstimateRequest: IEstimateRequestResponse;
  mover: {
    id: string;
    name: string;
    currentRole: string;
    profile: IProfile | null;
  };
}

export interface IMyRejectedEstimateRequestResponse {
  id: string;
  estimateRequestId: string;
  price: number | null;
  description: string;
  status: string;
  createdAt: Date;
  estimateRequest: IEstimateRequestResponse;
  mover: {
    id: string;
    name: string;
    currentRole: string;
    profile: IProfile | null;
  };
}

export interface ICreateEstimateResponse {
  id: string;
  estimateRequestId: string;
  moverId: string;
  price: number;
  description: string;
  status: "PROPOSED";
  createdAt: Date;
}

export interface IRejectEstimateResponse {
  id: string;
  estimateRequestId: string;
  moverId: string;
  price: number | null;
  description: string;
  status: "REJECTED";
  createdAt: Date;
}

export interface IUpdateEstimateStatusResponse {
  id: string;
  status: "PROPOSED" | "ACCEPTED" | "REJECTED" | "AUTO_REJECTED";
  updatedAt: Date;
}

export interface IUpdateEstimateResponse {
  id: string;
  price: number;
  description: string;
  updatedAt: Date;
}
