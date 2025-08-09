"use client";

import React from "react";
import { useTranslations } from "next-intl";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.svg";
import activeStar from "@/assets/icon/star/icon-star-active-lg.svg";
import Image from "next/image";
import type { MoverWithReviewsProps } from "@/types/mover.types";

const ReviewAvg = ({ mover, reviews }: MoverWithReviewsProps) => {
  const total = mover.totalReviewCount || 0;
  const avg = mover.averageRating || 0;
  const t = useTranslations("mover");

  // 점수별 개수 계산
  const reviewCounts = [5, 4, 3, 2, 1].reduce(
    (acc, score) => {
      acc[score] = reviews.filter((r) => r.rating === score).length;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>,
  );

  const maxCount = Math.max(...Object.values(reviewCounts));

  return (
    <section role="group" aria-labelledby="review-summary-title">
      <div className="flex flex-col gap-4">
        <h3 id="review-summary-title" className="text-xl font-semibold" role="heading" aria-level={3}>
          {t("reviewsTitle")}
        </h3>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          {/* 평균 평점 */}
          <div className="flex items-center gap-[18px]" role="group" aria-labelledby="avg-rating-title">
            <span id="avg-rating-title" className="sr-only">
              평균 평점
            </span>
            <span className="text-[40px] font-medium" aria-label={`5점 만점에 ${avg.toFixed(1)}점`}>
              {avg.toFixed(1)}
            </span>
            <div className="flex flex-col">
              {/* 별점 표시 */}
              <div className="flex" role="img" aria-label={`${Math.round(avg)}개의 별점`}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={i <= Math.round(avg) ? activeStar : inactiveStar}
                    alt=""
                    className="h-5 w-5"
                    role="presentation"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <span className="text-md text-[#808080]" aria-label={`총 ${total}개의 리뷰`}>
                {total}
                {t("reviewCount")}
              </span>
            </div>
          </div>

          {/* 점수별 리뷰 분포 */}
          <div className="flex w-[284px] flex-col gap-3" role="group" aria-labelledby="rating-distribution-title">
            <h4 id="rating-distribution-title" className="sr-only">
              점수별 리뷰 분포
            </h4>
            {[5, 4, 3, 2, 1].map((score) => {
              const count = reviewCounts[score as keyof typeof reviewCounts];
              const percent = total > 0 ? (count / total) * 100 : 0;
              const isMax = count === maxCount && count > 0;
              return (
                <div
                  key={score}
                  className="flex items-center gap-4"
                  role="group"
                  aria-label={`${score}점: ${count}개 (${percent.toFixed(1)}%)`}
                >
                  <span className={`text-md ${isMax ? "font-bold" : "font-medium"}`}>
                    {score}
                    {t("point")}
                  </span>
                  <div
                    className="relative h-3 flex-1 rounded-[15px] bg-[#EFEFEF]"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${score}점 리뷰 비율 ${percent.toFixed(1)}%`}
                  >
                    <div
                      className="absolute top-0 left-0 h-3 rounded-[15px] bg-[#FFC149]"
                      style={{ width: `${percent}%` }}
                      aria-hidden="true"
                    ></div>
                  </div>
                  <div className="w-9">
                    <span
                      className={`text-md text-[#ababab] ${isMax ? "font-bold" : "font-medium"}`}
                      aria-label={`${count}개`}
                    >
                      {count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewAvg;
