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
  const [quoteId, setQuoteId] = useState<string | undefined>(undefined);
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
        const response = await findMoverApi.getMoverReviews(mover.id, 1, 1000);

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
        setQuoteId(undefined);
        setIsLoadingQuote(false);
        return;
      }

      try {
        setIsLoadingQuote(true);
        const response = await estimateRequestClientApi.getActive(locale);

        if (response.success && response.data && response.data.id) {
          setQuoteId(String(response.data.id));
        } else {
          setQuoteId(undefined);
        }
      } catch (error) {
        console.error("[DetailInformation] 활성 견적 조회 실패:", error);
        setQuoteId(undefined);
      } finally {
        setIsLoadingQuote(false);
      }
    };

    fetchActiveQuote();
  }, [isLoggedIn, user?.userType]);

  return (
    <div
      className={`mt-[35px] ${deviceType === "desktop" ? "flex justify-center gap-[116px]" : "flex flex-col items-center"} w-full px-5 md:mt-[46px] md:px-18 lg:mt-[62px] lg:px-[100px]`}
    >
      <div className="w-full md:w-[600px] lg:w-[742px]">
        <div>
          <MoverIntro mover={mover} reviews={allReviews} />
        </div>
        <div className="mt-8 lg:mt-10">
          <Chip mover={mover} />
        </div>
        <div className="mt-8 mb-8 h-[1px] w-full border border-[#F2F2F2] lg:mt-10 lg:mb-10"></div>
        {/* 공유 컴포넌트 */}
        {deviceType === "desktop" ? (
          ""
        ) : (
          <>
            <div className="flex flex-col gap-3">
              <p className="text-lg font-semibold">{t("shareMessage")}</p>
              <ShareButtonGroup
                title={shareInfo.title}
                description={shareInfo.description}
                imageUrl={shareInfo.imageUrl}
              />
            </div>
            <div className="mt-8 mb-8 h-[1px] w-full border border-[#F2F2F2] lg:mt-10 lg:mb-10"></div>
          </>
        )}

        <ReviewAvg mover={mover} reviews={allReviews} />

        <ReviewList moverId={mover.id} onReviewsFetched={setReviews} />
      </div>
      <div className="flex w-full flex-col lg:w-80 lg:gap-[22px]">
        {isLoadingQuote ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <RequestButton mover={mover} quoteId={quoteId} onMoverUpdate={onMoverUpdate} />
        )}
        {deviceType === "desktop" ? (
          <ShareButtonGroup title={shareInfo.title} description={shareInfo.description} imageUrl={shareInfo.imageUrl} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DetailInformation;
