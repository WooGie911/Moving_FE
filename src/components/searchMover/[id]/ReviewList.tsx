import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { IReview, IApiReview, IReviewListProps } from "@/types/review";
import findMoverApi from "@/lib/api/findMover.api";
import Image from "next/image";
import activeStar from "@/assets/icon/star/icon-star-active-lg.png";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.png";
import Pagination from "@/components/common/pagination/Pagination";

// 사용자 이름 마스킹 함수
const maskUserName = (name: string): string => {
  if (!name || name.length <= 1) return name;
  return name.charAt(0) + "*".repeat(name.length - 1);
};

const PAGE_SIZE = 5;

const ReviewList = ({ moverId, onReviewsFetched }: IReviewListProps) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const t = useTranslations("mover");

  useEffect(() => {
    if (!moverId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await findMoverApi.getMoverReviews(moverId, currentPage, PAGE_SIZE);

        const convertedReviews: IReview[] = response.data.items.map((apiReview: IApiReview) => ({
          id: apiReview.id,
          rating: apiReview.rating,
          content: apiReview.content,
          createdAt: apiReview.createdAt,
          userId: apiReview.customerId,
          moverId: apiReview.moverId,
          quoteId: apiReview.estimateRequestId,
          estimateId: apiReview.estimate?.id || "",
          status: "COMPLETED" as const,
          isPublic: true,
          user: {
            id: apiReview.customerId,
            name: apiReview.nickname,
          },
        }));

        setReviews(convertedReviews);
        setTotalPages(Math.ceil(response.data.total / PAGE_SIZE));

        if (onReviewsFetched) {
          onReviewsFetched(convertedReviews);
        }
      } catch (error) {
        console.error("리뷰 조회 실패:", error);
        setReviews([]);
        setTotalPages(1);
        if (onReviewsFetched) {
          onReviewsFetched([]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [moverId, currentPage, onReviewsFetched]);

  // 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
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
          <div className="text-lg text-gray-500">{t("loadingMessage")}</div>
        </div>
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="mt-20 mb-[200px] flex w-full flex-col items-center">
        <p className="text-lg font-semibold">{t("noReviewsYet")}</p>
        <p className="text-md text-[#999999]">{t("registerReviewFirst")}</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <ul className="mb-[109px]">
        {reviews.map((review, idx) => (
          <React.Fragment key={review.id}>
            <li className="py-5 md:py-6">
              <div className="mb-4 flex flex-col gap-2 md:mb-6">
                <div className="flex items-center gap-3 md:gap-[14px]">
                  <span className="text-md md:text-2lg font-normal">{maskUserName(review.user.name)}</span>
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
