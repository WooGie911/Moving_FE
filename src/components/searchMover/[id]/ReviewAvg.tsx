"use client";

import React, { useEffect, useState } from "react";
import inactiveStar from "@/assets/icon/star/icon-star-inactive-lg.png";
import activeStar from "@/assets/icon/star/icon-star-active-lg.png";
import Image from "next/image";
import { MoverWithReceivedReviewsProps } from "@/types/moverDetail";
import reviewApi from "@/lib/api/review.api";

interface TReviewStats {
  averageRating: number;
  totalReviewCount: number;
  ratingDistribution: { [key: number]: number };
}

const ReviewAvg = ({ mover, reviews }: MoverWithReceivedReviewsProps) => {
  const [stats, setStats] = useState<TReviewStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!mover.id) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const reviewStats = await reviewApi.fetchMoverReviewStats(String(mover.id));
        setStats(reviewStats);
      } catch (error) {
        console.error("리뷰 통계 조회 실패:", error);
        // API 실패 시 현재 리뷰 데이터로 계산
        const total = reviews.length;
        const avg = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
        const ratingDistribution = [5, 4, 3, 2, 1].reduce(
          (acc, score) => {
            acc[score] = reviews.filter((r) => r.rating === score).length;
            return acc;
          },
          { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as { [key: number]: number },
        );
        setStats({
          averageRating: avg,
          totalReviewCount: total,
          ratingDistribution,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [mover.id, reviews]);

  // API 데이터가 없으면 현재 리뷰 데이터로 계산
  const total = stats?.totalReviewCount || reviews.length;
  const avg = stats?.averageRating || (reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0);
  const ratingDistribution = stats?.ratingDistribution || [5, 4, 3, 2, 1].reduce(
    (acc, score) => {
      acc[score] = reviews.filter((r) => r.rating === score).length;
      return acc;
    },
    { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as { [key: number]: number },
  );

  const maxCount = Math.max(...Object.values(ratingDistribution));

  if (loading) {
    return (
      <div>
        <div className="flex flex-col gap-4">
          <p className="text-xl font-semibold">리뷰</p>
          <div className="flex items-center justify-center py-8">
            <div className="border-primary-400 h-6 w-6 animate-spin rounded-full border-4 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-4">
        <p className="text-xl font-semibold">리뷰</p>
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
              <p className="text-md text-[#808080]">{total}개의 리뷰</p>
            </div>
          </div>
          <div className="flex w-[284px] flex-col gap-3">
            {[5, 4, 3, 2, 1].map((score) => {
              const count = ratingDistribution[score] || 0;
              const percent = total > 0 ? (count / total) * 100 : 0;
              const isMax = count === maxCount && count > 0;
              return (
                <div key={score} className="flex items-center gap-4">
                  <p className={`text-md ${isMax ? "font-bold" : "font-medium"}`}>{score}점</p>
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
