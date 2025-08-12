"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import noReview from "@/assets/img/mascot/notfound.webp";
import Image from "next/image";
import { IWrittenCardData } from "@/types/review";
import WrittenMoverCard from "@/components/review/written/WrittenMoverCard";
import reviewApi from "@/lib/api/review.api";
import { useAuth } from "@/providers/AuthProvider";
import Pagination from "@/components/common/pagination/Pagination";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useTranslations, useLocale } from "next-intl";

const PAGE_SIZE = 4;

const WrittenReviewPage = () => {
  const [page, setPage] = useState(1);
  const router = useRouter();
  const { user } = useAuth();
  const customerId = user?.id ? String(user.id) : null;
  const t = useTranslations("review");
  const locale = useLocale();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleNavigateDetail = (moverId: string) => {
    router.push(`/searchMover/${moverId}`);
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["writtenReviews", customerId, page, locale],
    queryFn: () =>
      customerId
        ? reviewApi.fetchWrittenReviews(customerId, page, PAGE_SIZE, locale)
        : Promise.resolve({ items: [], total: 0, page, pageSize: PAGE_SIZE, hasNextPage: false, hasPrevPage: false }),
    enabled: !!customerId,
  });

  const reviews = (data?.items ?? []) as unknown as IWrittenCardData[];
  const totalPages = data ? Math.ceil(data.total / (data.pageSize || PAGE_SIZE)) : 1;

  return (
    <>
      {isPending ? (
        /*TODO: 한국어 하드 코딩 번역으로 변경할 것 */
        <MovingTruckLoader size="lg" loadingText="내가 작성한 리뷰를 불러오는 중입니다..." />
      ) : (
        <main className="flex min-h-screen flex-col items-center bg-gray-100 px-6 py-10">
          {isError ? (
            <section className="py-10 text-center text-red-500" aria-label="오류 발생">
              <p>{t("error")}</p>
            </section>
          ) : reviews.length === 0 ? (
            <section className="flex flex-col items-center justify-center py-20" aria-label="작성된 리뷰 없음">
              <Image src={noReview} alt={t("noWrittenReviewsAlt")} className="mb-6 h-50 w-60" />
              <p className="text-lg font-semibold text-gray-400">{t("noWrittenReviews")}</p>
            </section>
          ) : (
            <section className="flex w-full flex-col items-center gap-6" aria-label="작성된 리뷰 목록">
              {reviews.map((card) => (
                <article key={card.id}>
                  <button onClick={() => handleNavigateDetail(card.mover.id)}>
                    <WrittenMoverCard
                      id={card.id}
                      profileImage={card.mover.profileImage}
                      nickname={card.mover.nickname}
                      shortIntro={card.mover.shortIntro}
                      fromAddress={card.fromAddress}
                      toAddress={card.toAddress}
                      moveDate={card.moveDate}
                      rating={card.rating}
                      content={card.content}
                      createdAt={card.createdAt}
                      experience={card.mover.experience}
                      averageRating={card.mover.averageRating}
                      totalReviews={card.mover.totalReviews}
                    />
                  </button>
                </article>
              ))}
            </section>
          )}
          <footer className="mt-8 flex justify-center">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} size="sm" />
          </footer>
        </main>
      )}
    </>
  );
};

export default WrittenReviewPage;
