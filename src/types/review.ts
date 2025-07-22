export interface IWritableCardData {
  id: string;
  profileImage: string;
  nickname: string;
  movingType: "SMALL" | "HOME" | "OFFICE";
  isDesigned: boolean;
  moverIntroduction: string;
  departureAddr: string;
  arrivalAddr: string;
  movingDate: string;
  price: number;
}

export interface IFetchWritableQuotesResult {
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
  movingType: "SMALL" | "HOME" | "OFFICE";
  isDesigned: boolean;
  moverIntroduction: string;
  departureAddr: string;
  arrivalAddr: string;
  movingDate: string;
  rating: number;
  content: string;
  createdAt: Date;
}
