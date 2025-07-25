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
