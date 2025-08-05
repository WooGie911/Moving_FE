import { TAddress } from "./moverEstimate";

// 공통 주소 타입
export interface IAddress {
  id: string;
  city: string;
  district: string;
  detail: string;
  region: string;
  postalCode: string;
}

// 무버 정보 타입 (실제 사용하는 데이터만)
export interface IMover {
  id: string;
  profileImage: string | null;
  nickname: string;
  shortIntro: string;
  experience: number;
  averageRating: number;
  totalReviews: number;
}

// 고객 정보 타입 (실제 사용하는 데이터만)
export interface ICustomer {
  id: string;
  profileImage: string | null;
  nickname: string;
}

// 견적 정보 타입 (실제 사용하는 데이터만)
export interface IEstimate {
  id: string;
  price: number;
  comment: string | null;
  status: string;
  isDesignated: boolean;
  validUntil: string;
  createdAt: string;
}

// 페이지네이션 응답 타입
export interface IPaginationResponse {
  items: any[];
  total: number;
  page: number;
  pageSize: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// 작성 가능한 리뷰 카드 데이터 (실제 사용하는 데이터만)
export interface IWritableCardData {
  id: string;
  reviewId: string;
  moveType: string;
  isDesigned: boolean;
  mover: IMover;
  fromAddress: IAddress;
  toAddress: IAddress;
  moveDate: string;
  estimate: IEstimate;
}

// 작성된 리뷰 카드 데이터 (실제 사용하는 데이터만)
export interface IWrittenCardData {
  id: string;
  mover: IMover;
  fromAddress: IAddress;
  toAddress: IAddress;
  moveDate: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 받은 리뷰 카드 데이터 (실제 사용하는 데이터만)
export interface IReceivedCardData {
  id: string;
  customer: ICustomer;
  fromAddress: IAddress;
  toAddress: IAddress;
  moveDate: string;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt: string;
}

// 리뷰 작성 폼 데이터
export interface IReviewForm {
  rating: number;
  content: string;
}

// API 응답 타입들
export interface IWritableReviewsResponse extends IPaginationResponse {
  items: IWritableCardData[];
}

export interface IWrittenReviewsResponse extends IPaginationResponse {
  items: IWrittenCardData[];
}

export interface IReceivedReviewsResponse extends IPaginationResponse {
  items: IReceivedCardData[];
}

// 기존 타입들 (하위 호환성을 위해 유지)
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

export interface IApiReview {
  id: string;
  estimateRequestId: string;
  customerId: string;
  moverId: string;
  profileImage: string | null;
  nickname: string;
  customer?: {
    id: string;
    nickname: string;
    profileImage: string;
    detailIntro: string | null;
  };
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

export interface IReviewListResponse {
  items: IReview[];
  total: number;
  page: number;
  pageSize: number;
}

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

export interface IReviewsProps {
  reviews: IReview[];
}

export interface IReviewListProps {
  moverId: string;
  onReviewsFetched?: (reviews: IReview[]) => void;
}
