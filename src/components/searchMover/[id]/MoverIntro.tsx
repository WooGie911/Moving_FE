import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import badge from "@/assets/icon/etc/icon-chat.png";
import like from "@/assets/icon/like/icon-like-black-lg.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import type { MoverWithReviewsProps } from "@/types/mover.types";

const MoverIntro = ({ mover }: MoverWithReviewsProps) => {
  const total = mover.totalReviewCount || 0;
  const avg = mover.averageRating || 0;
  const t = useTranslations("mover");
  const tShared = useTranslations("shared");
  const [isExpanded, setIsExpanded] = useState(false);
  const [showMoreButton, setShowMoreButton] = useState(false);
  const descriptionRef = useRef<HTMLHeadingElement>(null);

  // 텍스트가 두 줄을 넘어가는지 확인
  useEffect(() => {
    if (descriptionRef.current) {
      const element = descriptionRef.current;
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight);
      const maxHeight = lineHeight * 2;

      if (element.scrollHeight > maxHeight) {
        setShowMoreButton(true);
      }
    }
  }, [mover.description]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <section role="group" aria-labelledby="mover-name-title">
      {/* 서비스 타입 태그 */}
      <div className="flex gap-2" role="group" aria-label="제공 서비스 타입">
        {mover.serviceTypes.map((serviceType, idx) => (
          <MoveTypeLabel key={idx} type={serviceType.service?.name || "기타"} />
        ))}
      </div>

      {/* 기사님 설명 */}
      <div className="mt-2 mb-4 md:mt-3 md:mb-5">
        <h3
          id="mover-description"
          ref={descriptionRef}
          className="text-2lg font-semibold md:text-2xl"
          style={{
            display: !isExpanded && showMoreButton ? "-webkit-box" : "block",
            WebkitLineClamp: !isExpanded && showMoreButton ? 2 : "unset",
            WebkitBoxOrient: !isExpanded && showMoreButton ? "vertical" : "unset",
            overflow: !isExpanded && showMoreButton ? "hidden" : "visible",
            textOverflow: !isExpanded && showMoreButton ? "ellipsis" : "unset",
          }}
          role="heading"
          aria-level={3}
          aria-expanded={isExpanded}
          aria-describedby={showMoreButton ? "description-toggle" : undefined}
        >
          {mover.description}
        </h3>
        {showMoreButton && (
          <button
            id="description-toggle"
            onClick={toggleExpanded}
            className="focus:ring-primary-400 mt-2 rounded text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:ring-2 focus:ring-offset-2 focus:outline-none"
            aria-expanded={isExpanded}
            aria-controls="mover-description"
            aria-label={isExpanded ? "설명 접기" : "설명 더보기"}
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        )}
      </div>

      {/* 기사님 이름과 찜 수 */}
      <header className="mb-4 flex justify-between" id="mover-name-title">
        <div className="flex items-center gap-1">
          {(mover.completedCount || 0) > 30 && (
            <Image
              src={badge}
              alt="전문 기사 인증 배지"
              className="h-[23px] w-[20px]"
              role="img"
              aria-label="30건 이상 완료한 전문 기사님입니다"
            />
          )}
          <h2 className="md:text-2lg text-lg font-semibold" role="heading" aria-level={2}>
            {mover.nickname} {t("driverSuffix")}
          </h2>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="찜한 고객 수">
          <span className="text-md md:text-2lg font-medium text-[#808080]">{mover.favoriteCount || 0}</span>
          <Image src={like} alt="" className="h-6 w-6" role="presentation" aria-hidden="true" />
          <span className="sr-only">명의 고객이 찜했습니다</span>
        </div>
      </header>

      {/* 기사님 한줄 소개 */}
      <p
        className="text-md mb-8 leading-6 font-normal text-[#808080] md:text-lg md:leading-[26px]"
        role="text"
        aria-label="기사님 한줄 소개"
      >
        {mover.introduction}
      </p>

      {/* 기사님 통계 정보 */}
      <section
        className="max-gap-9 max-px-[70px] md:max-gap-[97px] lg:max-gap-42 flex items-center justify-center rounded-xl border border-gray-200 py-[24.5px] md:rounded-2xl md:py-8"
        role="group"
        aria-labelledby="mover-stats-title"
      >
        <h3 id="mover-stats-title" className="sr-only">
          기사님 실적 통계
        </h3>

        {/* 진행 건수 */}
        <div className="flex w-full flex-col items-center" role="group" aria-labelledby="completed-label">
          <span id="completed-label" className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">
            {t("inProgress")}
          </span>
          <span className="text-lg font-semibold md:text-xl md:font-bold" aria-describedby="completed-label">
            {mover.completedCount || 0}
            {tShared("units.cases")}
          </span>
        </div>

        {/* 리뷰 평점 */}
        <div className="flex w-full flex-col items-center" role="group" aria-labelledby="rating-label">
          <span id="rating-label" className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">
            {t("reviews")}
          </span>
          <div className="flex items-center gap-[6px]" aria-describedby="rating-label">
            <Image src={star} alt="" className="h-5 w-5 md:h-6 md:w-6" role="presentation" aria-hidden="true" />
            <span className="text-lg font-semibold md:text-xl md:font-bold">{avg.toFixed(1)}</span>
            <span className="text-md font-medium text-[#ABABAB] md:text-lg">({total})</span>
            <span className="sr-only">
              5점 만점에 {avg.toFixed(1)}점, 총 {total}개의 리뷰
            </span>
          </div>
        </div>

        {/* 총 경력 */}
        <div className="flex w-full flex-col items-center" role="group" aria-labelledby="experience-label">
          <span id="experience-label" className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">
            {t("totalExperience")}
          </span>
          <span className="text-lg font-semibold md:text-xl md:font-bold" aria-describedby="experience-label">
            {mover.experience || 0}
            {tShared("units.years")}
          </span>
        </div>
      </section>
    </section>
  );
};

export default MoverIntro;
