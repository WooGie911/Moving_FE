import React, { useEffect, useState } from "react";
import { IReview } from "@/types/findMover";
import { getMockReviewsForMover } from "@/lib/utils/mockReviewData";
import Image from "next/image";
import activeStar from "@/assets/icon/star/icon-star-active-lg.png";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.png";
import { ReviewListProps } from "@/types/moverDetail";
import Pagination from "@/components/common/pagination";

const PAGE_SIZE = 5;

const ReviewList = ({ moverId, onReviewsFetched }: ReviewListProps) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (!moverId) return;

    setLoading(true);

    // Mock 데이터 사용
    const mockReviews = getMockReviewsForMover(moverId);
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    const paginatedReviews = mockReviews.slice(startIndex, endIndex);

    setReviews(paginatedReviews);
    setTotalPages(Math.ceil(mockReviews.length / PAGE_SIZE));

    if (onReviewsFetched) {
      onReviewsFetched(mockReviews); // 전체 리뷰 데이터 전달
    }

    setLoading(false);
  }, [moverId, currentPage, onReviewsFetched]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 2자리, 앞에 0
    const day = String(date.getDate()).padStart(2, "0"); // 2자리, 앞에 0
    return `${year}-${month}-${day}`;
  };

  // 별점 렌더링 함수
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Image key={index} src={index < rating ? activeStar : inactiveStar} alt="star" className={`h-5 w-5`} />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">리뷰를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="w-full">
        <p className="mb-[51px] text-xl font-semibold">리뷰</p>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">아직 등록된 리뷰가 없어요!</p>
          <p className="text-md text-[#999999]">가장 먼저 리뷰를 등록해보세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul className="">
        {reviews.map((review, idx) => (
          <React.Fragment key={review.id}>
            <li className="py-5 md:py-6">
              <div className="mb-4 flex flex-col gap-2 md:mb-6">
                <div className="flex items-center gap-3 md:gap-[14px]">
                  <span className="text-md md:text-2lg font-normal">{review.user.name}</span>
                  <div className="text-[#E6E6E6]">|</div>
                  <span className="text-md md:text-2lg text-[#ABABAB]">{formatDate(review.createdAt)}</span>
                </div>
                <div className="flex items-center">{renderStars(review.rating)}</div>
              </div>
              <div className="text-md md:text-2lg leading-[24px]">{review.content}</div>
            </li>
            {idx !== reviews.length - 1 && <div className="mx-2 border-b border-gray-200" />}
          </React.Fragment>
        ))}
      </ul>
      {totalPages > 1 && (
        <div className="flex justify-center py-[34px] lg:my-[109px]">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </div>
  );
};

export default ReviewList;
