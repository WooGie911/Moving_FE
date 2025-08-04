import type { IReview } from "./review";

// 기사님 정보 타입 (기본)
export interface IMover {
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
  totalFavoriteCount: number;
  serviceAreas: Array<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
    district: string | null;
    region: string;
    userId: string;
  }>;
  serviceTypes: string[];
  favorites?: Array<{ id: string }>;
}

// 기사님 정보 타입 (API 응답용)
export interface IMoverInfo extends IMover {
  // IMover의 모든 속성을 상속받음
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
