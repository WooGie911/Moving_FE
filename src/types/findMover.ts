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

export interface IReviewListResponse {
  items: IReview[];
  total: number;
  page: number;
  pageSize: number;
}
