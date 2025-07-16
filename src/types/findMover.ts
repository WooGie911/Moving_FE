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
