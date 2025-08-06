"use client";

import React from "react";
import { useTranslations } from "next-intl";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.png";
import activeStar from "@/assets/icon/star/icon-star-active-lg.png";
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
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">{t("reviewsTitle")}</p>
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-center gap-[18px]">
            <p className="text-[40px] font-medium">{avg.toFixed(1)}</p>
            <div className="flex flex-col">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Image
                    key={i}
                    src={i <= Math.round(avg) ? activeStar : inactiveStar}
                    alt={i <= Math.round(avg) ? "activeStar-image" : "inactiveStar-image"}
                    className="h-5 w-5"
                  />
                ))}
              </div>
              <p className="text-md text-[#808080]">
                {total}
                {t("reviewCount")}
              </p>
            </div>
          </div>
          <div className="flex w-[284px] flex-col gap-3">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = reviewCounts[score as keyof typeof reviewCounts];
              const percent = total > 0 ? (count / total) * 100 : 0;
              const isMax = count === maxCount && count > 0;
              return (
                <div key={score} className="flex items-center gap-4">
                  <p className={`text-md ${isMax ? "font-bold" : "font-medium"}`}>
                    {score}
                    {t("point")}
                  </p>
                  <div className="relative h-3 flex-1 rounded-[15px] bg-[#EFEFEF]">
                    <div
                      className="absolute top-0 left-0 h-3 rounded-[15px] bg-[#FFC149]"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <div className="w-9">
                    <p className={`text-md text-[#ababab] ${isMax ? "font-bold" : "font-medium"}`}>{count}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAvg;
