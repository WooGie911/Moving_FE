"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewApi from "@/lib/api/review.api";
import WritableMoverCardList from "@/components/review/writable/WritableMoverCardList";
import noReview from "@/assets/img/mascot/notfound.webp";
import Image from "next/image";
import { IWritableCardData, IReviewForm } from "@/types/review";

import ReviewWriteModal from "@/components/review/writable/ReviewWriteModal";
import { useModal } from "@/components/common/modal/ModalContext";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import Pagination from "@/components/common/pagination/Pagination";
import { useTranslations, useLocale } from "next-intl";

const WritableReviewPage = () => {
  const [page, setPage] = useState(1);
  const { open, close } = useModal();
  const queryClient = useQueryClient();
  const deviceType = useWindowWidth();
  const t = useTranslations("review");
  const locale = useLocale();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["writableReviews", page, locale],
    queryFn: () => reviewApi.fetchWritableReviews(page, 4, locale),
    placeholderData: { items: [], total: 0, page, pageSize: 4 },
  });

  const { mutate: postReview, isPending } = useMutation({
    mutationFn: ({ reviewId, rating, content }: { reviewId: string; rating: number; content: string }) =>
      reviewApi.postReview(reviewId, rating, content, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writableReviews", page, locale] });
      close();
    },
    onError: () => {
      alert(t("reviewWriteFailed"));
    },
  });

  const onSubmit = (reviewId: string, data: IReviewForm) => {
    postReview({ reviewId, ...data });
  };

  const handleWriteModalOpen = (card: IWritableCardData) => {
    const modalType = deviceType === "mobile" ? "bottomSheet" : "center";
    open({
      title: t("writeReview"),
      type: modalType,
      children: card ? (
        <ReviewWriteModal card={card} onSubmit={(data) => onSubmit(card.reviewId, data)} isSubmitting={isPending} />
      ) : null,
    });
  };

  const cards = (data?.items ?? []) as unknown as IWritableCardData[];
  const totalPages = data ? Math.ceil(data.total / (data.pageSize || 4)) : 1;

  return (
    <main className="flex flex-col items-center justify-center px-6 py-10">
      {isLoading ? (
        <section className="py-10 text-center" aria-label="로딩 중">
          <p>{t("loading")}</p>
        </section>
      ) : isError ? (
        <section className="py-10 text-center text-red-500" aria-label="오류 발생">
          <p>{t("error")}</p>
        </section>
      ) : cards.length === 0 ? (
        <section className="flex flex-col items-center justify-center py-20" aria-label="작성 가능한 리뷰 없음">
          <Image src={noReview} alt={t("noWritableReviews")} className="mb-6 h-50 w-60" />
          <p className="text-lg font-semibold text-gray-400">{t("noWritableReviews")}</p>
        </section>
      ) : (
        <section className="w-full" aria-label="작성 가능한 리뷰 목록">
          <WritableMoverCardList cards={cards} onClickWrite={handleWriteModalOpen} />
        </section>
      )}
      <footer className="mt-8 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} size="sm" />
      </footer>
    </main>
  );
};

export default WritableReviewPage;
