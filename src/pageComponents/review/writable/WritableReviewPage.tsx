"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import reviewApi from "@/lib/api/review.api";
import WritableMoverCardList from "@/components/review/writable/WritableMoverCardList";
import noReview from "@/assets/img/mascot/notfound.webp";
import Image from "next/image";
import { IWritableCardData, IReviewForm } from "@/types/review";

import ReviewWriteModal from "@/components/review/writable/ReviewWriteModal";
import { useModal } from "@/components/common/modal/ModalContext";
import Pagination from "@/components/common/pagination/Pagination";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useTranslations, useLocale } from "next-intl";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

const WritableReviewPage = () => {
  const [page, setPage] = useState(1);
  const { open: openModal, close: closeModal } = useModal();
  const queryClient = useQueryClient();
  const t = useTranslations("review");
  const locale = useLocale();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data, isPending, isError } = useQuery({
    queryKey: ["writableReviews", page, locale],
    queryFn: () => reviewApi.fetchWritableReviews(page, 4, locale),
  });

  const { mutate: postReview, isPending: isSubmitting } = useMutation({
    mutationFn: ({ reviewId, rating, content }: { reviewId: string; rating: number; content: string }) =>
      reviewApi.postReview(reviewId, rating, content, locale),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writableReviews", page, locale] });
      closeModal();
      showSuccessToast(t("reviewWriteSuccess"));
    },
    onError: () => {
      showErrorToast(t("reviewWriteFailed"));
    },
  });

  const onSubmit = useCallback(
    (reviewId: string, data: IReviewForm) => {
      // 확인 모달 표시
      openModal({
        title: t("confirmReviewWrite"),
        type: "center",
        children: (
          <div className="py-4 text-center">
            <p className="mb-4 text-gray-700">{t("confirmReviewWriteMessage")}</p>
          </div>
        ),
        buttons: [
          {
            text: t("cancel"),
            onClick: closeModal,
            variant: "outlined",
          },
          {
            text: t("confirm"),
            onClick: () => {
              closeModal();
              postReview({ reviewId, ...data });
            },
            disabled: isSubmitting,
          },
        ],
      });
    },
    [openModal, closeModal, postReview, isSubmitting, t],
  );

  const handleWriteModalOpen = useCallback(
    (card: IWritableCardData) => {
      openModal({
        title: t("writeReview"),
        type: "center",
        children: card ? (
          <ReviewWriteModal card={card} onSubmit={(data) => onSubmit(card.reviewId, data)} isSubmitting={isSubmitting} />
        ) : null,
      });
    },
    [openModal, t, onSubmit, isSubmitting],
  );

  // URL 쿼리 파라미터 처리 - 리뷰 작성 모달 자동 열기
  useEffect(() => {
    const modal = searchParams.get("modal");
    const reviewId = searchParams.get("reviewId");

    if (modal === "write" && reviewId) {
      // 데이터가 로드된 후에 해당 리뷰 카드를 찾아서 모달 열기
      if (data?.items && data.items.length > 0) {
        const targetCard = data.items.find((card: IWritableCardData) => card.reviewId === reviewId);
        if (targetCard) {
          handleWriteModalOpen(targetCard);
        }
      }
    }
  }, [searchParams, data?.items, handleWriteModalOpen]);

  const cards = (data?.items ?? []) as unknown as IWritableCardData[];
  const totalPages = data ? Math.ceil(data.total / (data.pageSize || 4)) : 1;

  return (
    <>
      {isPending ? (
        <MovingTruckLoader size="lg" loadingText="작성 가능한 리뷰를 불러오는 중입니다..." />
      ) : isSubmitting ? (
        <MovingTruckLoader size="lg" loadingText="리뷰를 작성하는 중입니다..." />
      ) : (
        <main className="flex min-h-screen flex-col items-center bg-gray-100 px-6 py-10">
          {isError ? (
            <section className="py-10 text-center text-red-500" aria-label="오류 발생">
              <p>{t("error")}</p>
            </section>
          ) : cards.length === 0 ? (
            <section className="flex flex-col items-center justify-center py-20" aria-label="작성 가능한 리뷰 없음">
              <Image src={noReview} alt={t("noWritableReviews")} className="mb-6 h-50 w-60" />
              <p className="text-lg font-semibold text-gray-400">{t("noWritableReviews")}</p>
            </section>
          ) : (
            <section className="flex w-full justify-center" aria-label="작성 가능한 리뷰 목록">
              <WritableMoverCardList cards={cards} onClickWrite={handleWriteModalOpen} />
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

export default WritableReviewPage;
