"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import reviewApi from "@/lib/api/review.api";
import WritableMoverCardList from "@/components/review/writable/WritableMoverCardList";
import noReview from "@/assets/img/mascot/notfound.png";
import Image from "next/image";
import { IWritableCardData, IReviewForm } from "@/types/review";

import ReviewWriteModal from "@/components/review/writable/ReviewWriteModal";
import { useModal } from "@/components/common/modal/ModalContext";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import Pagination from "@/components/common/pagination/Pagination";
import { useTranslations } from "next-intl";

const WritableReviewPage = () => {
  const [page, setPage] = useState(1);
  const { open, close } = useModal();
  const queryClient = useQueryClient();
  const deviceType = useWindowWidth();
  const t = useTranslations("review");

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["writableReviews", page],
    queryFn: () => reviewApi.fetchWritableReviews(page),
    placeholderData: { items: [], total: 0, page, pageSize: 4 },
  });

  const { mutate: postReview, isPending } = useMutation({
    mutationFn: ({ reviewId, rating, content }: { reviewId: string; rating: number; content: string }) =>
      reviewApi.postReview(reviewId, rating, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["writableReviews", page] });
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
    <div className="flex flex-col items-center justify-center px-6 py-10">
      {isLoading ? (
        <div className="py-10 text-center">{t("common.loading")}</div>
      ) : isError ? (
        <div className="py-10 text-center text-red-500">{t("common.error")}</div>
      ) : cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Image src={noReview} alt={t("noWritableReviews")} className="mb-6 h-50 w-60" />
          <div className="text-lg font-semibold text-gray-400">{t("noWritableReviews")}</div>
        </div>
      ) : (
        <WritableMoverCardList cards={cards} onClickWrite={handleWriteModalOpen} />
      )}
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChange} size="sm" />
      </div>
    </div>
  );
};

export default WritableReviewPage;
