import { IMoverInfo, IReview, IReceivedReview } from "./findMover";

export interface MoverProps {
  mover: IMoverInfo;
}

// 일반 리뷰를 위한 타입들
export interface ReviewsProps {
  reviews: IReview[];
}

export interface MoverWithReviewsProps extends MoverProps, ReviewsProps {}

// 기사님이 받은 리뷰를 위한 타입들
export interface ReceivedReviewsProps {
  reviews: IReceivedReview[];
}

export interface MoverWithReceivedReviewsProps extends MoverProps, ReceivedReviewsProps {}

export interface ReviewListProps {
  moverId: number;
  onReviewsFetched?: (reviews: IReceivedReview[]) => void;
}

export interface TopBarProps {
  profileImage?: string | null;
}
