// 백엔드 API 응답 구조에 맞는 타입 정의
export interface IEstimateRequestProps {
  moveType: string;
  createdAt: Date;
  moveDate: Date;
  fromAddress: TAddress;
  toAddress: TAddress;
}

// 주소 타입 (백엔드와 일치)
export type TAddress = {
  zoneCode: string;
  city: string;
  district: string;
  detail: string | null;
  region: string;
};

export interface ILabelAndTitleSectionProps {
  mover: TMoverInfo;
  estimate: TEstimateResponse;
  usedAt: "pending" | "received" | "detail";
} // 기타 컴포넌트 Props 타입들
export interface IMoverInfoProps {
  mover: TMoverInfo;
  usedAt: "pending" | "received" | "detail";
  estimateId?: string;
}

type TMoveType = "HOME" | "OFFICE" | "SMALL";

// Favorite 타입 정의 (백엔드 기준)
export type TFavorite = { id: string };

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
  serviceTypes: string[]; // TMoveType[] → string[]로 변경
  serviceAreas: Array<{
    // string[] → 백엔드와 동일한 구조로 변경
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    district: string | null;
    region: string;
    userId: string;
  }>;
  isFavorite: boolean;
  totalFavoriteCount: number;
  Favorite?: TFavorite[];
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
export type TPendingEstimateRequestResponse = {
  estimateRequest: TEstimateRequestResponse | null; // null 가능하도록 수정
  estimates: TEstimateResponse[];
};

// 완료된 견적 응답 타입 (백엔드와 일치) - 단일 객체로 수정
export type TReceivedEstimateRequestResponse = {
  estimateRequest: TEstimateRequestResponse;
  estimates: TEstimateResponse[];
};

// 견적 상세 조회 응답 타입 (백엔드와 일치)
export type TEstimateRequestDetailResponse = {
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
export interface IDesignateEstimateRequestRequest {
  message: string;
  moverId: string;
}

// 견적 확정 응답 타입 (백엔드와 일치)
export type TConfirmEstimateResponse = {
  estimateRequest: {
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
  estimate: {
    id: string;
    estimateRequestId: string;
    price: number | null;
    comment: string | null;
    status: string;
    isDesignated: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
};

// 지정 견적 요청 응답 타입 (백엔드와 일치)
export interface IDesignatedMover {
  id: string;
  estimateRequestId: string;
  customerId: string;
  moverId: string;
  message: string;
  status: string;
  expiresAt: Date;
}
export type TDesignateEstimateRequest = IDesignatedMover;

// 견적 취소 응답 타입 (백엔드와 일치)
export type TCancelEstimateResponse = {
  id: string;
  estimateRequestId: string;
  price: number | null;
  comment: string | null;
  status: string;
  isDesignated: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// 이사완료 응답 타입 (백엔드와 일치)
export type TCompleteEstimateResponse = {
  estimateRequest: {
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
};

// 완료된 견적 목록을 위한 타입 (배열) - 백엔드와 일치하도록 수정
export type TReceivedEstimateRequestListResponse = TReceivedEstimateRequestResponse[];

// 기존 타입들 (호환성 유지)
export interface ICardListProps {
  estimateRequest: TEstimateRequestResponse | null; // null 가능하도록 수정
  estimate: TEstimateResponse;
  usedAt: "pending" | "received";
}

export interface IDetailPageMainSeactionProps {
  estimateRequest: TEstimateRequestResponse | null;
  estimate: TEstimateResponse;
  type: "pending" | "received";
  estimates?: TEstimateResponse[];
}

// 기존 인터페이스들 (호환성을 위해 유지)
export interface IEstimateRequest {
  id: string;
  movingType: "SMALL" | "HOME" | "OFFICE";
  movingDate: Date | string;
  createdAt: Date | string;
  departureAddr: string;
  arrivalAddr: string;
  arrivalDetail: string | null;
  departureDetail: string | null;
  status: string;
  confirmedEstimateId: string | null;
  estimateCount: number;
  designatedEstimateCount: number;
  serviceTypes?: TMoveType[];
}

export interface IEstimate {
  id: string;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: TMoverInfo;
}

export interface IPendingEstimateRequestResponse {
  EstimateRequest: IEstimateRequest;
  estimates: IEstimate[];
}

export interface IReceivedEstimateRequestResponse {
  EstimateRequest: IEstimateRequest;
  estimates: IEstimate[];
}

export interface IEstimateRequestDetailResponse {
  id: string;
  price: number;
  description: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "EXPIRED";
  isDesignated: boolean;
  mover: TMoverInfo;
}
