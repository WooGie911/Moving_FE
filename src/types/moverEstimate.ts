
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
