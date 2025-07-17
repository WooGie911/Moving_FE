import { IMoverInfo, IReview } from "./findMover";

export interface MoverProps {
  mover: IMoverInfo;
}

export interface ReviewsProps {
  reviews: IReview[];
}

export interface MoverWithReviewsProps extends MoverProps, ReviewsProps {}

export interface ReviewListProps {
  moverId: number;
  onReviewsFetched?: (reviews: IReview[]) => void;
}

export interface TopBarProps {
  profileImage?: string | null;
}
