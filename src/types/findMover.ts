export interface IMoverInfo {
  id: number;
  userId: number;
  nickname: string;
  profileImage: string | null;
  experience: number;
  introduction: string;
  description: string;
  completedCount: number;
  avgRating: number;
  reviewCount: number;
  favoriteCount: number;
  lastActivityAt: Date | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
  serviceRegions: any[];
  serviceTypes: any[];
}

export interface IMoverListParams {
  region?: string;
  serviceTypeId?: number;
  search?: string;
  sort?: "review" | "rating" | "career" | "confirmed";
  cursor?: number;
  take?: number;
}

export interface FavoriteMoverListProps {
  movers: IMoverInfo[];
}

export interface IReview {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  userId: number;
  moverId: number;
  quoteId: number;
  estimateId: number;
  status: "PENDING" | "COMPLETED";
  isPublic: boolean;
  updatedAt?: string;
  user: {
    id: number;
    name: string;
  };
}

// 실제 API 응답 구조에 맞는 리뷰 타입
export interface IReceivedReview {
  id: string;
  estimateRequestId: string | null;
  customerId: string;
  moverId: string;
  profileImage: string | null;
  nickname: string;
  moveType: "SMALL" | "HOME" | "OFFICE" | null;
  isDesigned: boolean;
  moverIntroduction: string | null;
  fromAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  } | null;
  toAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  } | null;
  moveDate: string | null;
  rating: number;
  content: string;
  createdAt: string;
  estimate: {
    id: string;
    price: number;
    comment: string | null;
    status: string;
    isDesignated: boolean;
    validUntil: string;
    workingHours: number;
    includesPackaging: boolean;
    insuranceAmount: number;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export interface IReviewListResponse {
  items: IReview[];
  total: number;
  page: number;
  pageSize: number;
}

// 실제 API 응답 구조에 맞는 리뷰 리스트 응답 타입
export interface IReceivedReviewListResponse {
  items: IReceivedReview[];
  total: number;
  page: number;
  pageSize: number;
}
