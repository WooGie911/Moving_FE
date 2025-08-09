import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import Chip from "./Chip";
import MoverIntro from "./MoverIntro";
import ReviewAvg from "./ReviewAvg";
import ReviewList from "./ReviewList";
import RequestButton from "./RequestButton";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ShareButtonGroup } from "@/components/common/button/ShareButtonGroup";
import type { DetailInformationProps } from "@/types/mover.types";
import { estimateRequestClientApi } from "@/lib/api/estimateRequest.client";
import findMoverApi from "@/lib/api/findMover.api";
import type { IReview, IApiReview } from "@/types/review";

const DetailInformation = ({ mover, onMoverUpdate }: DetailInformationProps) => {
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [allReviews, setAllReviews] = useState<IReview[]>([]);
  const [estimateRequestId, setEstimateRequestId] = useState<string | undefined>(undefined);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const deviceType = useWindowWidth();
  const { isLoggedIn, user } = useAuth();
  const t = useTranslations("mover");
  const locale = useLocale();

  // 기사님 정보를 포함한 공유 메시지 생성
  const generateShareMessage = () => {
    const shareTitle = `${mover.nickname} 기사님을 추천드려요! - Moving`;

    // 서비스 타입을 안전하게 처리
    const serviceTypeNames =
      mover.serviceTypes
        ?.map((serviceType) => (typeof serviceType === "string" ? serviceType : serviceType.service?.name))
        .filter(Boolean)
        .join(", ") || "이사 서비스";

    // 경력을 안전하게 처리 (career 필드 사용)
    const careerYears = mover.career || 0;

    // 평점을 안전하게 처리 (averageRating 필드 사용)
    const rating = mover.averageRating || 0;

    const shareDescription = `${mover.nickname} 기사님을 소개합니다! ${careerYears}년 경력의 전문 기사님으로, ${serviceTypeNames} 서비스를 제공합니다. 평점 ${rating.toFixed(1)}점의 신뢰할 수 있는 기사님입니다.`;
    const shareImageUrl = mover.profileImage || "https://gomoving.site/logo-m.png"; // 기사님 프로필 이미지 또는 기본 로고

    return { title: shareTitle, description: shareDescription, imageUrl: shareImageUrl };
  };

  const shareInfo = generateShareMessage();

  // 전체 리뷰 데이터 가져오기 (ReviewAvg용)
  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        const response = await findMoverApi.getMoverReviews(mover.id, 1, 1000, undefined, "COMPLETED");

        const convertedReviews: IReview[] = response.data.items.map((apiReview: any) => ({
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

        setAllReviews(convertedReviews);
      } catch (error) {
        console.error("전체 리뷰 조회 실패:", error);
        setAllReviews([]);
      }
    };

    fetchAllReviews();
  }, [mover.id]);

  useEffect(() => {
    const fetchActiveQuote = async () => {
      // 로그인한 고객 사용자만 활성 견적 조회
      if (!isLoggedIn || user?.userType !== "CUSTOMER") {
        setEstimateRequestId(undefined);
        setIsLoadingQuote(false);
        return;
      }

      try {
        setIsLoadingQuote(true);
        const response = await estimateRequestClientApi.getActive(locale);

        if (response.success && response.data && response.data.id) {
          setEstimateRequestId(String(response.data.id));
        } else {
          setEstimateRequestId(undefined);
        }
      } catch (error) {
        console.error("[DetailInformation] 활성 견적 조회 실패:", error);
        setEstimateRequestId(undefined);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchActiveQuote();
  }, [isLoggedIn, user?.userType]);

  return (
    <div
      className={`mt-[35px] ${deviceType === "desktop" ? "flex justify-center gap-[116px]" : "flex flex-col items-center"} w-full px-5 md:mt-[46px] md:px-18 lg:mt-[62px] lg:px-[100px]`}
      role="main"
    >
      <article className="w-full md:w-[600px] lg:w-[742px]" aria-labelledby="mover-intro-title">
        <section aria-labelledby="mover-intro-title">
          <h2 id="mover-intro-title" className="sr-only">
            기사님 소개
          </h2>
          <MoverIntro mover={mover} reviews={allReviews} />
        </section>

        <section className="mt-8 lg:mt-10" aria-labelledby="service-info-title">
          <h2 id="service-info-title" className="sr-only">
            제공 서비스 정보
          </h2>
          <Chip mover={mover} />
        </section>

        <hr className="mt-8 mb-8 h-[1px] w-full border border-[#F2F2F2] lg:mt-10 lg:mb-10" aria-hidden="true" />

        {deviceType === "desktop" ? null : (
          <>
            <section className="flex flex-col gap-3" aria-labelledby="share-title">
              <h2 id="share-title" className="text-lg font-semibold" role="heading" aria-level={2}>
                {t("shareMessage")}
              </h2>
              <ShareButtonGroup
                title={shareInfo.title}
                description={shareInfo.description}
                imageUrl={shareInfo.imageUrl}
              />
            </section>
            <hr className="mt-8 mb-8 h-[1px] w-full border border-[#F2F2F2] lg:mt-10 lg:mb-10" aria-hidden="true" />
          </>
        )}

        <section aria-labelledby="review-avg-title">
          <h2 id="review-avg-title" className="sr-only">
            리뷰 평점 요약
          </h2>
          <ReviewAvg mover={mover} reviews={allReviews} />
        </section>

        <section aria-labelledby="review-list-title">
          <h2 id="review-list-title" className="sr-only">
            고객 리뷰 목록
          </h2>
          <ReviewList moverId={mover.id} onReviewsFetched={setReviews} />
        </section>
      </article>

      <aside
        className="flex w-full flex-col lg:w-80 lg:gap-[22px]"
        role="complementary"
        aria-labelledby="sidebar-title"
      >
        <h2 id="sidebar-title" className="sr-only">
          견적 요청 및 공유
        </h2>

        <section aria-labelledby="request-title">
          <h3 id="request-title" className="sr-only">
            견적 요청
          </h3>
          {isLoadingQuote ? (
            <div
              className="flex items-center justify-center py-4"
              role="status"
              aria-live="polite"
              aria-label="견적 정보 로딩 중"
            >
              <div
                className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"
                aria-hidden="true"
              ></div>
              <span className="sr-only">견적 정보를 불러오는 중입니다.</span>
            </div>
          ) : (
            <RequestButton mover={mover} estimateRequestId={estimateRequestId} onMoverUpdate={onMoverUpdate} />
          )}
        </section>

        {/* 공유 섹션 (데스크톱) */}
        {deviceType === "desktop" && (
          <section aria-labelledby="desktop-share-title">
            <h3 id="desktop-share-title" className="sr-only">
              기사님 정보 공유
            </h3>
            <ShareButtonGroup
              title={shareInfo.title}
              description={shareInfo.description}
              imageUrl={shareInfo.imageUrl}
            />
          </section>
        )}
      </aside>
    </div>
  );
};

export default DetailInformation;
