// 프론트엔드 리뷰 타입
export interface IReview {
  id: string;
  customerId: string;
  moverId: string;
  estimateRequestId: string;
  rating: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  estimateRequest: {
    id: string;
    customerId: string;
    moveType: string;
    moveDate: Date;
    fromAddress: TAddress;
    toAddress: TAddress;
    description: string | null;
    status: string;
  };
  estimate: {
    id: string;
    price: number;
    comment: string | null;
    status: string;
    isDesignated: boolean;
    createdAt: Date;
  };
}

// 백엔드 API 응답에 맞는 리뷰 타입
export interface IApiReview {
  id: string;
  estimateRequestId: string;
  customerId: string;
  moverId: string;
  profileImage: string | null;
  nickname: string;
  moveType: string;
  isDesigned: boolean;
  moverIntroduction: string | null;
  fromAddress: any;
  toAddress: any;
  moveDate: string;
  rating: number;
  content: string;
  createdAt: string;
  estimate: any;
}

// 리뷰 리스트 응답 타입
export interface IReviewListResponse {
  items: IReview[];
  total: number;
  page: number;
  pageSize: number;
}

// 백엔드 API 리뷰 리스트 응답 타입
export interface IApiReviewListResponse {
  success: boolean;
  message: string;
  data: {
    items: IApiReview[];
    total: number;
    page: number;
    pageSize: number;
  };
}

// 리뷰 관련 컴포넌트 props
export interface IReviewsProps {
  reviews: IReview[];
}

export interface IReviewListProps {
  moverId: string;
  onReviewsFetched?: (reviews: IReview[]) => void;
}

// 리뷰 작성 관련 타입
export interface IWritableCardData {
  id: string;
  reviewId: string;
  profileImage: string;
  nickname: string;
  moveType: "SMALL" | "HOME" | "OFFICE";
  isDesigned: boolean;
  moverIntroduction: string;
  fromAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  };
  toAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  };
  moveDate: string;
  price: number;
}

export interface IFetchWritableReviewsResult {
  cards: IWritableCardData[];
  total: number;
  page: number;
  pageSize: number;
}

export interface IReviewForm {
  rating: number;
  content: string;
}

export interface IWrittenCardData {
  id: string;
  moverId: string;
  profileImage: string | null;
  nickname: string;
  moveType: "SMALL" | "HOME" | "OFFICE";
  isDesigned: boolean;
  moverIntroduction: string;
  fromAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  };
  toAddress: {
    city: string;
    district: string;
    detail: string;
    region: string;
  };
  moveDate: string;
  rating: number;
  content: string;
  createdAt: string;
}
