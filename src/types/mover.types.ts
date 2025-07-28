import type { IReview } from "./review";

// 기사님 정보 타입
export interface IMoverInfo {
  id: string;
  userId: string;
  nickname: string;
  profileImage: string | null;
  experience: number;
  introduction: string;
  description: string;
  completedCount: number;
  avgRating: number;
  reviewCount: number;
  favoriteCount: number;
  isFavorited?: boolean;
  lastActivityAt: Date | null;
  user: {
    id: string;
    name: string;
    email: string;
  };
  serviceRegions: any[];
  serviceTypes: any[];
  quoteId: string;
  estimateRequestId: string;
}

// 기사님 목록 조회 파라미터 타입
export interface IMoverListParams {
  region?: string;
  serviceTypeId?: number;
  search?: string;
  sort?: "review" | "rating" | "career" | "confirmed";
  cursor?: string;
  take?: number;
}

// 기사님 서비스 지역 타입
export interface ServiceRegion {
  region: string;
  name?: string;
}

// 기사님 서비스 타입
export interface ServiceType {
  service: {
    name: string;
  };
}

// 기사님 관련 컴포넌트 props 타입
export interface MoverProps {
  mover: IMoverInfo;
}

export interface DetailInformationProps extends MoverProps {
  onMoverUpdate?: () => void;
}

export interface FavoriteMoverListProps {
  movers: IMoverInfo[];
}

export interface MoverWithReviewsProps extends MoverProps {
  reviews: IReview[];
}

export interface TopBarProps {
  profileImage?: string | null;
}

export interface MoverListResponse {
  items: IMoverInfo[];
  nextCursor: string | null;
  hasNext: boolean;
}

export interface DesignatedQuoteRequestResponse {
  id: string;
  estimateRequestId: string;
  moverId: string;
  message?: string;
  expiresAt: string;
  createdAt: string;
}

export interface DesignatedQuoteRequestCheckResponse {
  hasRequested: boolean;
  requestId: string | null;
  message: string | null;
  expiresAt: string | null;
}