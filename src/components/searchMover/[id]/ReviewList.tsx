import React, { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import type { IReview, IApiReview, IReviewListProps } from "@/types/review";
import findMoverApi from "@/lib/api/findMover.api";
import Image from "next/image";
import activeStar from "@/assets/icon/star/icon-star-active-lg.png";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.png";
import Pagination from "@/components/common/pagination/Pagination";

// 사용자 이름 마스킹 함수
const maskUserName = (name: string): string => {
  if (!name || name.length <= 1) return name;
  return name.charAt(0) + "***";
};

const PAGE_SIZE = 5;

const ReviewList = ({ moverId, onReviewsFetched }: IReviewListProps) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [apiReviews, setApiReviews] = useState<IApiReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const t = useTranslations("mover");
  const locale = useLocale();

  useEffect(() => {
    if (!moverId) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await findMoverApi.getMoverReviews(moverId, currentPage, PAGE_SIZE, locale, "COMPLETED");

        const convertedReviews: IReview[] = response.data.items.map((apiReview: IApiReview) => ({
          id: apiReview.id,
          customerId: apiReview.customerId,
          moverId: apiReview.moverId,
          estimateRequestId: apiReview.estimateRequestId,
          rating: apiReview.rating,
          content: apiReview.content,
          createdAt: new Date(apiReview.createdAt),
          updatedAt: new Date(apiReview.createdAt),
          deletedAt: null,
          estimateRequest: {
            id: apiReview.estimateRequestId,
            customerId: apiReview.customerId,
            moveType: apiReview.moveType,
            moveDate: new Date(apiReview.moveDate),
            fromAddress: apiReview.fromAddress,
            toAddress: apiReview.toAddress,
            description: null,
            status: "COMPLETED",
          },
          estimate: {
            id: apiReview.estimate?.id || "",
            price: apiReview.estimate?.price || 0,
            comment: null,
            status: "COMPLETED",
            isDesignated: apiReview.isDesigned,
            createdAt: new Date(apiReview.createdAt),
          },
        }));

        setReviews(convertedReviews);
        setApiReviews(response.data.items);
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
    return (
      <div role="img" aria-label={`${rating}점 별점`} className="flex">
        {Array.from({ length: 5 }, (_, index) => (
          <Image
            key={index}
            src={index < rating ? activeStar : inactiveStar}
            alt=""
            className={`h-5 w-5`}
            role="presentation"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <section
        className="flex items-center justify-center py-8"
        role="status"
        aria-live="polite"
        aria-label="리뷰 로딩 중"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"
            aria-hidden="true"
          ></div>
          <span className="text-lg text-gray-500">{t("loadingMoverInfo")}</span>
        </div>
      </section>
    );
  }

  if (!reviews.length) {
    return (
      <section className="mt-20 mb-[200px] flex w-full flex-col items-center" role="status" aria-live="polite">
        <h3 className="text-lg font-semibold" role="heading" aria-level={3}>
          {t("noReviewsYet")}
        </h3>
        <p className="text-md text-[#999999]">{t("registerReviewFirst")}</p>
      </section>
    );
  }

  return (
    <section className="mt-4" role="group" aria-labelledby="reviews-list-title">
      <h3 id="reviews-list-title" className="sr-only">
        고객 리뷰 목록
      </h3>
      <ul className="mb-[109px]" role="list" aria-label={`총 ${reviews.length}개의 리뷰`}>
        {reviews.map((review, idx) => {
          const apiReview = apiReviews[idx];
          return (
            <React.Fragment key={review.id}>
              <li
                className="py-5 md:py-6"
                role="listitem"
                aria-labelledby={`review-${review.id}-author`}
                aria-describedby={`review-${review.id}-content`}
              >
                <article role="article">
                  <header className="mb-4 flex flex-col gap-2 md:mb-6">
                    <div className="flex items-center gap-3 md:gap-[14px]">
                      <span id={`review-${review.id}-author`} className="text-md md:text-2lg font-normal" role="text">
                        {maskUserName(apiReview?.customer?.nickname || "익명")}
                      </span>
                      <span className="text-[#E6E6E6]" aria-hidden="true">
                        |
                      </span>
                      <time
                        className="text-md md:text-2lg text-[#ABABAB]"
                        dateTime={apiReview?.createdAt || ""}
                        aria-label={`리뷰 작성일 ${formatDate(apiReview?.createdAt || "")}`}
                      >
                        {apiReview?.createdAt || ""}
                      </time>
                    </div>
                    <div className="flex items-center">{renderStars(review.rating)}</div>
                  </header>
                  <div id={`review-${review.id}-content`} className="text-md md:text-2lg leading-[24px]" role="text">
                    {review.content}
                  </div>
                </article>
              </li>
              {idx !== reviews.length - 1 && <hr className="mx-2 border-b border-gray-200" aria-hidden="true" />}
            </React.Fragment>
          );
        })}
      </ul>
      {totalPages > 1 && (
        <nav
          className="flex justify-center py-[34px] lg:my-[109px]"
          aria-label="리뷰 페이지 네비게이션"
          role="navigation"
        >
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </nav>
      )}
    </section>
  );
};

export default ReviewList;
