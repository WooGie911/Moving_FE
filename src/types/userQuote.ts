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

export type TProfile = {
  nickname: string;
  profileImage?: string | null;
  experience?: number; // 경력
  introduction: string;
  completedCount: number; // 완료된 이사 건수
  avgRating: number; // 평균 평점
  reviewCount: number; // 리뷰 총 개수
  favoriteCount: number; // 찜한 사용자 수
  description: string;
  serviceTypes?: {
    service: TServiceType;
  }[];
};

export type TMover = {
  id: number | string;
  name: string;
  currentRole: "CUSTOMER" | "MOVER";
  profile: TProfile;
};

// 백엔드 API 응답 타입들
export interface IQuote {
  id: number;
  movingType: "SMALL" | "HOME" | "OFFICE" | "small" | "home" | "office";
  movingDate: Date | undefined;
  createdAt: Date | undefined;
  departureAddr: string;
  arrivalAddr: string;
  arrivalDetail: string | null;
  departureDetail: string | null;
  status: string;
  confirmedEstimateId: number | null;
  estimateCount: number;
  designatedEstimateCount: number;
  serviceTypes?: TServiceType[];
}

// 기존 타입들 (호환성 유지)
export interface ICardListProps {
  isDesignated: boolean;
  estimateId: string | number;
  estimateState: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED" | "SENT";
  estimateTitle: string;
  estimatePrice: number;
  mover: TMover;
  type: "pending" | "received";
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
      serviceTypes?: {
        service: TServiceType;
      }[];
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

// 완료된 견적 목록을 위한 타입 (배열)
export type IReceivedQuoteListResponse = IReceivedQuoteResponse[];

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
      serviceTypes?: {
        service: TServiceType;
      }[];
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
  completedAt: Date | string;
}

export interface IDetailPageMainSeactionProps {
  quote: IQuote;
  estimate: IEstimate;
  type: "pending" | "received";
}

// IPendingQuoteResponse 예시 데이터
export const mockPendingQuoteResponses: IPendingQuoteResponse = {
  quote: {
    id: 1,
    movingType: "HOME",
    movingDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5일 후
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7일 전
    departureAddr: "서울시 강남구 테헤란로 123",
    arrivalAddr: "서울시 서초구 서초대로 456",
    departureDetail: "101동 304호",
    arrivalDetail: "202동 501호",
    status: "PENDING",
    confirmedEstimateId: null,
    estimateCount: 3,
    designatedEstimateCount: 1,
  },
  estimates: [
    {
      id: 101,
      price: 150000,
      description: "안전하고 신속한 이사 서비스 제공합니다. 포장부터 설치까지 완벽하게 도와드립니다.",
      status: "PENDING",
      isDesignated: true,
      mover: {
        id: 1,
        name: "김이사",
        currentRole: "MOVER",
        profile: {
          nickname: "김이사",
          profileImage: "",
          experience: 5,
          introduction: "5년 경력의 전문 이사업체입니다.",
          description: "신중하고 안전한 이사 서비스",
          completedCount: 120,
          avgRating: 4.8,
          reviewCount: 45,
          favoriteCount: 23,
          serviceTypes: [
            {
              service: {
                id: 1,
                name: "가정이사",
                description: "가정집 이사 전문 서비스",
                iconUrl: "/icons/home-moving.png",
              },
            },
            {
              service: {
                id: 2,
                name: "소형이사",
                description: "소형 물품 이사 서비스",
                iconUrl: "/icons/small-moving.png",
              },
            },
          ],
        },
      },
    },
    {
      id: 102,
      price: 180000,
      description: "고급 포장재 사용으로 안전한 운송을 보장합니다.",
      status: "PENDING",
      isDesignated: false,
      mover: {
        id: 2,
        name: "박이사",
        currentRole: "MOVER",
        profile: {
          nickname: "박이사",
          profileImage: "",
          experience: 8,
          introduction: "8년 경력의 전문 이사업체입니다.",
          description: "고급 포장재 사용 전문",
          completedCount: 200,
          avgRating: 4.9,
          reviewCount: 78,
          favoriteCount: 45,
          serviceTypes: [
            {
              service: {
                id: 1,
                name: "가정이사",
                description: "가정집 이사 전문 서비스",
                iconUrl: "/icons/home-moving.png",
              },
            },
            {
              service: {
                id: 3,
                name: "사무실이사",
                description: "사무실 이사 전문 서비스",
                iconUrl: "/icons/office-moving.png",
              },
            },
          ],
        },
      },
    },
    {
      id: 103,
      price: 130000,
      description: "합리적인 가격으로 양질의 서비스를 제공합니다.",
      status: "PENDING",
      isDesignated: false,
      mover: {
        id: 3,
        name: "이이사",
        currentRole: "MOVER",
        profile: {
          nickname: "이이사",
          profileImage: "",
          experience: 3,
          introduction: "3년 경력의 이사업체입니다.",
          description: "합리적인 가격 전문",
          completedCount: 80,
          avgRating: 4.6,
          reviewCount: 32,
          favoriteCount: 15,
        },
      },
    },
    {
      id: 301,
      price: 250000,
      description: "사무실 이사 전문 서비스입니다. 업무 중단 최소화로 진행합니다.",
      status: "PENDING",
      isDesignated: true,
      mover: {
        id: 6,
        name: "한이사",
        currentRole: "MOVER",
        profile: {
          nickname: "한이사",
          profileImage: "",
          experience: 10,
          introduction: "10년 경력의 사무실 이사 전문업체입니다.",
          description: "사무실 이사 전문",
          completedCount: 300,
          avgRating: 4.9,
          reviewCount: 120,
          favoriteCount: 65,
        },
      },
    },
    {
      id: 302,
      price: 280000,
      description: "고급 사무실 이사 서비스입니다. 전문 장비와 인력으로 진행합니다.",
      status: "PENDING",
      isDesignated: true,
      mover: {
        id: 7,
        name: "송이사",
        currentRole: "MOVER",
        profile: {
          nickname: "송이사",
          profileImage: "",
          experience: 12,
          introduction: "12년 경력의 고급 사무실 이사 전문업체입니다.",
          description: "고급 사무실 이사",
          completedCount: 400,
          avgRating: 5.0,
          reviewCount: 180,
          favoriteCount: 95,
        },
      },
    },
    {
      id: 303,
      price: 220000,
      description: "합리적인 가격의 사무실 이사 서비스입니다.",
      status: "PENDING",
      isDesignated: false,
      mover: {
        id: 8,
        name: "강이사",
        currentRole: "MOVER",
        profile: {
          nickname: "강이사",
          profileImage: "",
          experience: 7,
          introduction: "7년 경력의 사무실 이사업체입니다.",
          description: "합리적인 사무실 이사",
          completedCount: 180,
          avgRating: 4.7,
          reviewCount: 75,
          favoriteCount: 35,
        },
      },
    },
    {
      id: 304,
      price: 240000,
      description: "신속한 사무실 이사 서비스입니다. 업무 연속성을 보장합니다.",
      status: "PENDING",
      isDesignated: false,
      mover: {
        id: 9,
        name: "윤이사",
        currentRole: "MOVER",
        profile: {
          nickname: "윤이사",
          profileImage: "",
          experience: 9,
          introduction: "9년 경력의 신속 이사 전문업체입니다.",
          description: "신속한 사무실 이사",
          completedCount: 250,
          avgRating: 4.8,
          reviewCount: 95,
          favoriteCount: 48,
        },
      },
    },
  ],
};

// IReceivedQuoteListResponse 예시 데이터 5개
export const mockReceivedQuoteListResponses: IReceivedQuoteListResponse = [
  {
    quote: {
      id: 101,
      movingType: "HOME",
      movingDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15일 전
      createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20일 전
      departureAddr: "서울시 강남구 테헤란로 123",
      arrivalAddr: "서울시 서초구 서초대로 456",
      departureDetail: "101동 304호",
      arrivalDetail: "202동 501호",
      status: "COMPLETED",
      confirmedEstimateId: 1001,
      estimateCount: 3,
      designatedEstimateCount: 1,
    },
    estimates: [
      {
        id: 1001,
        price: 150000,
        description: "안전하고 신속한 이사 서비스 제공합니다. 포장부터 설치까지 완벽하게 도와드립니다.",
        status: "ACCEPTED",
        isDesignated: true,
        mover: {
          id: 1,
          name: "김이사",
          currentRole: "MOVER",
          profile: {
            nickname: "김이사",
            profileImage: "",
            experience: 5,
            introduction: "5년 경력의 전문 이사업체입니다.",
            description: "신중하고 안전한 이사 서비스",
            completedCount: 125,
            avgRating: 4.8,
            reviewCount: 46,
            favoriteCount: 24,
            serviceTypes: [
              {
                service: {
                  id: 1,
                  name: "가정이사",
                  description: "가정집 이사 전문 서비스",
                  iconUrl: "/icons/home-moving.png",
                },
              },
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 1002,
        price: 180000,
        description: "고급 포장재 사용으로 안전한 운송을 보장합니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 2,
          name: "박이사",
          currentRole: "MOVER",
          profile: {
            nickname: "박이사",
            profileImage: "",
            experience: 8,
            introduction: "8년 경력의 전문 이사업체입니다.",
            description: "고급 포장재 사용 전문",
            completedCount: 200,
            avgRating: 4.9,
            reviewCount: 78,
            favoriteCount: 45,
            serviceTypes: [
              {
                service: {
                  id: 1,
                  name: "가정이사",
                  description: "가정집 이사 전문 서비스",
                  iconUrl: "/icons/home-moving.png",
                },
              },
              {
                service: {
                  id: 3,
                  name: "사무실이사",
                  description: "사무실 이사 전문 서비스",
                  iconUrl: "/icons/office-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 1003,
        price: 130000,
        description: "합리적인 가격으로 양질의 서비스를 제공합니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 3,
          name: "이이사",
          currentRole: "MOVER",
          profile: {
            nickname: "이이사",
            profileImage: "",
            experience: 3,
            introduction: "3년 경력의 이사업체입니다.",
            description: "합리적인 가격 전문",
            completedCount: 80,
            avgRating: 4.6,
            reviewCount: 32,
            favoriteCount: 15,
            serviceTypes: [
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
    ],
  },
  {
    quote: {
      id: 102,
      movingType: "SMALL",
      movingDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000), // 25일 전
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30일 전
      departureAddr: "서울시 마포구 와우산로 789",
      arrivalAddr: "서울시 성동구 왕십리로 321",
      departureDetail: "2층 201호",
      arrivalDetail: "5층 502호",
      status: "COMPLETED",
      confirmedEstimateId: 2001,
      estimateCount: 2,
      designatedEstimateCount: 0,
    },
    estimates: [
      {
        id: 2001,
        price: 80000,
        description: "소형 이사 전문 서비스입니다. 빠르고 깔끔하게 처리해드립니다.",
        status: "ACCEPTED",
        isDesignated: false,
        mover: {
          id: 4,
          name: "최이사",
          currentRole: "MOVER",
          profile: {
            nickname: "최이사",
            profileImage: "",
            experience: 4,
            introduction: "소형 이사 전문업체입니다.",
            description: "소형 이사 전문",
            completedCount: 96,
            avgRating: 4.7,
            reviewCount: 39,
            favoriteCount: 19,
            serviceTypes: [
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 2002,
        price: 95000,
        description: "신중하고 꼼꼼한 소형 이사 서비스 제공합니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 5,
          name: "정이사",
          currentRole: "MOVER",
          profile: {
            nickname: "정이사",
            profileImage: "",
            experience: 6,
            introduction: "6년 경력의 소형 이사 전문업체입니다.",
            description: "신중한 소형 이사",
            completedCount: 150,
            avgRating: 4.8,
            reviewCount: 62,
            favoriteCount: 28,
            serviceTypes: [
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
    ],
  },
  {
    quote: {
      id: 103,
      movingType: "OFFICE",
      movingDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000), // 35일 전
      createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000), // 40일 전
      departureAddr: "서울시 종로구 종로 456",
      arrivalAddr: "서울시 중구 을지로 789",
      departureDetail: "3층 301호",
      arrivalDetail: "7층 701호",
      status: "COMPLETED",
      confirmedEstimateId: 3001,
      estimateCount: 4,
      designatedEstimateCount: 2,
    },
    estimates: [
      {
        id: 3001,
        price: 250000,
        description: "사무실 이사 전문 서비스입니다. 업무 중단 최소화로 진행합니다.",
        status: "ACCEPTED",
        isDesignated: true,
        mover: {
          id: 6,
          name: "한이사",
          currentRole: "MOVER",
          profile: {
            nickname: "한이사",
            profileImage: "",
            experience: 10,
            introduction: "10년 경력의 사무실 이사 전문업체입니다.",
            description: "사무실 이사 전문",
            completedCount: 301,
            avgRating: 4.9,
            reviewCount: 121,
            favoriteCount: 66,
            serviceTypes: [
              {
                service: {
                  id: 3,
                  name: "사무실이사",
                  description: "사무실 이사 전문 서비스",
                  iconUrl: "/icons/office-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 3002,
        price: 280000,
        description: "고급 사무실 이사 서비스입니다. 전문 장비와 인력으로 진행합니다.",
        status: "REJECTED",
        isDesignated: true,
        mover: {
          id: 7,
          name: "송이사",
          currentRole: "MOVER",
          profile: {
            nickname: "송이사",
            profileImage: "",
            experience: 12,
            introduction: "12년 경력의 고급 사무실 이사 전문업체입니다.",
            description: "고급 사무실 이사",
            completedCount: 400,
            avgRating: 5.0,
            reviewCount: 180,
            favoriteCount: 95,
            serviceTypes: [
              {
                service: {
                  id: 3,
                  name: "사무실이사",
                  description: "사무실 이사 전문 서비스",
                  iconUrl: "/icons/office-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 3003,
        price: 220000,
        description: "합리적인 가격의 사무실 이사 서비스입니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 8,
          name: "강이사",
          currentRole: "MOVER",
          profile: {
            nickname: "강이사",
            profileImage: "",
            experience: 7,
            introduction: "7년 경력의 사무실 이사업체입니다.",
            description: "합리적인 사무실 이사",
            completedCount: 180,
            avgRating: 4.7,
            reviewCount: 75,
            favoriteCount: 35,
            serviceTypes: [
              {
                service: {
                  id: 3,
                  name: "사무실이사",
                  description: "사무실 이사 전문 서비스",
                  iconUrl: "/icons/office-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 3004,
        price: 240000,
        description: "신속한 사무실 이사 서비스입니다. 업무 연속성을 보장합니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 9,
          name: "윤이사",
          currentRole: "MOVER",
          profile: {
            nickname: "윤이사",
            profileImage: "",
            experience: 9,
            introduction: "9년 경력의 신속 이사 전문업체입니다.",
            description: "신속한 사무실 이사",
            completedCount: 250,
            avgRating: 4.8,
            reviewCount: 95,
            favoriteCount: 48,
            serviceTypes: [
              {
                service: {
                  id: 3,
                  name: "사무실이사",
                  description: "사무실 이사 전문 서비스",
                  iconUrl: "/icons/office-moving.png",
                },
              },
            ],
          },
        },
      },
    ],
  },
  {
    quote: {
      id: 104,
      movingType: "HOME",
      movingDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45일 전
      createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000), // 50일 전
      departureAddr: "경기도 성남시 분당구 정자로 123",
      arrivalAddr: "경기도 용인시 기흥구 동백로 456",
      departureDetail: "102동 505호",
      arrivalDetail: "301동 802호",
      status: "COMPLETED",
      confirmedEstimateId: 4001,
      estimateCount: 3,
      designatedEstimateCount: 1,
    },
    estimates: [
      {
        id: 4001,
        price: 200000,
        description: "분당에서 용인까지 안전한 가정 이사 서비스입니다.",
        status: "ACCEPTED",
        isDesignated: true,
        mover: {
          id: 10,
          name: "조이사",
          currentRole: "MOVER",
          profile: {
            nickname: "조이사",
            profileImage: "",
            experience: 6,
            introduction: "6년 경력의 가정 이사 전문업체입니다.",
            description: "가정 이사 전문",
            completedCount: 161,
            avgRating: 4.8,
            reviewCount: 69,
            favoriteCount: 33,
            serviceTypes: [
              {
                service: {
                  id: 1,
                  name: "가정이사",
                  description: "가정집 이사 전문 서비스",
                  iconUrl: "/icons/home-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 4002,
        price: 230000,
        description: "고급 가정 이사 서비스입니다. 특별한 보관함을 제공합니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 11,
          name: "임이사",
          currentRole: "MOVER",
          profile: {
            nickname: "임이사",
            profileImage: "",
            experience: 8,
            introduction: "8년 경력의 고급 가정 이사 전문업체입니다.",
            description: "고급 가정 이사",
            completedCount: 220,
            avgRating: 4.9,
            reviewCount: 88,
            favoriteCount: 42,
            serviceTypes: [
              {
                service: {
                  id: 1,
                  name: "가정이사",
                  description: "가정집 이사 전문 서비스",
                  iconUrl: "/icons/home-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 4003,
        price: 180000,
        description: "합리적인 가격의 가정 이사 서비스입니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 12,
          name: "백이사",
          currentRole: "MOVER",
          profile: {
            nickname: "백이사",
            profileImage: "",
            experience: 4,
            introduction: "4년 경력의 가정 이사업체입니다.",
            description: "합리적인 가정 이사",
            completedCount: 120,
            avgRating: 4.6,
            reviewCount: 45,
            favoriteCount: 20,
            serviceTypes: [
              {
                service: {
                  id: 1,
                  name: "가정이사",
                  description: "가정집 이사 전문 서비스",
                  iconUrl: "/icons/home-moving.png",
                },
              },
            ],
          },
        },
      },
    ],
  },
  {
    quote: {
      id: 105,
      movingType: "SMALL",
      movingDate: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000), // 55일 전
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60일 전
      departureAddr: "서울시 송파구 올림픽로 321",
      arrivalAddr: "서울시 강동구 천호대로 654",
      departureDetail: "1층 101호",
      arrivalDetail: "3층 303호",
      status: "COMPLETED",
      confirmedEstimateId: 5001,
      estimateCount: 2,
      designatedEstimateCount: 0,
    },
    estimates: [
      {
        id: 5001,
        price: 70000,
        description: "송파에서 강동까지 소형 이사 서비스입니다.",
        status: "ACCEPTED",
        isDesignated: false,
        mover: {
          id: 13,
          name: "남이사",
          currentRole: "MOVER",
          profile: {
            nickname: "남이사",
            profileImage: "",
            experience: 3,
            introduction: "3년 경력의 소형 이사업체입니다.",
            description: "소형 이사 전문",
            completedCount: 86,
            avgRating: 4.5,
            reviewCount: 33,
            favoriteCount: 16,
            serviceTypes: [
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
      {
        id: 5002,
        price: 85000,
        description: "신중하고 꼼꼼한 소형 이사 서비스입니다.",
        status: "REJECTED",
        isDesignated: false,
        mover: {
          id: 14,
          name: "구이사",
          currentRole: "MOVER",
          profile: {
            nickname: "구이사",
            profileImage: "",
            experience: 5,
            introduction: "5년 경력의 소형 이사 전문업체입니다.",
            description: "신중한 소형 이사",
            completedCount: 140,
            avgRating: 4.7,
            reviewCount: 55,
            favoriteCount: 25,
            serviceTypes: [
              {
                service: {
                  id: 2,
                  name: "소형이사",
                  description: "소형 물품 이사 서비스",
                  iconUrl: "/icons/small-moving.png",
                },
              },
            ],
          },
        },
      },
    ],
  },
];
