export interface IWritableCardData {
  id: string;
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
  moveDate: Date;
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
  moveDate: Date;
  rating: number;
  content: string;
  createdAt: Date;
}
