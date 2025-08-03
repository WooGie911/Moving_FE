import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import badge from "@/assets/icon/etc/icon-chat.png";
import like from "@/assets/icon/like/icon-like-black-lg.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import type { MoverWithReviewsProps } from "@/types/mover.types";

const MoverIntro = ({ mover }: MoverWithReviewsProps) => {
  const total = mover.reviewCount;
  const avg = mover.avgRating;
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
    <div>
      <div className="flex gap-2">
        {mover.serviceTypes.map((serviceType, idx) => (
          <MoveTypeLabel key={idx} type={serviceType.service?.name || "기타"} />
        ))}
      </div>
      <div className="mt-2 mb-4 md:mt-3 md:mb-5">
        <h2
          ref={descriptionRef}
          className="text-2lg font-semibold md:text-2xl"
          style={{
            display: !isExpanded && showMoreButton ? "-webkit-box" : "block",
            WebkitLineClamp: !isExpanded && showMoreButton ? 2 : "unset",
            WebkitBoxOrient: !isExpanded && showMoreButton ? "vertical" : "unset",
            overflow: !isExpanded && showMoreButton ? "hidden" : "visible",
            textOverflow: !isExpanded && showMoreButton ? "ellipsis" : "unset",
          }}
        >
          {mover.description}
        </h2>
        {showMoreButton && (
          <button
            onClick={toggleExpanded}
            className="mt-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-800 focus:outline-none"
          >
            {isExpanded ? t("showLess") : t("showMore")}
          </button>
        )}
      </div>
      <div className="mb-4 flex justify-between">
        <div className="flex items-center gap-1">
          {mover.completedCount > 30 && <Image src={badge} alt="badge-image" className="h-[23px] w-[20px]" />}
          <p className="md:text-2lg text-lg font-semibold">
            {mover.nickname} {t("driverSuffix")}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <p className="text-md md:text-2lg font-medium text-[#808080]">{mover.favoriteCount}</p>
          <Image src={like} alt="like-image" className="h-6 w-6" />
        </div>
      </div>
      <p className="text-md mb-8 leading-6 font-normal text-[#808080] md:text-lg md:leading-[26px]">
        {mover.introduction}
      </p>
      <div className="max-gap-9 max-px-[70px] md:max-gap-[97px] lg:max-gap-42 flex items-center justify-center rounded-xl border border-gray-200 py-[24.5px] md:rounded-2xl md:py-8">
        <div className="flex w-full flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">{t("inProgress")}</p>
          <p className="text-lg font-semibold md:text-xl md:font-bold">
            {mover.completedCount}
            {tShared("units.cases")}
          </p>
        </div>
        <div className="flex w-full flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">{t("reviews")}</p>
          <div className="flex items-center gap-[6px]">
            <Image src={star} alt="star-image" className="h-5 w-5 md:h-6 md:w-6" />
            <p className="text-lg font-semibold md:text-xl md:font-bold">{avg.toFixed(1)}</p>
            <p className="text-md font-medium text-[#ABABAB] md:text-lg">({total})</p>
          </div>
        </div>
        <div className="flex w-full flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">{t("totalExperience")}</p>
          <p className="text-lg font-semibold md:text-xl md:font-bold">
            {mover.experience}
            {tShared("units.years")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoverIntro;
