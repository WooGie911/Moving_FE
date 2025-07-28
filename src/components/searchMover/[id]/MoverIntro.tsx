import { MoveTypeLabel } from "@/components/common/chips/MoveTypeLabel";
import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";
import { getServiceTypeForLabel } from "@/lib/utils/translationUtils";
import badge from "@/assets/icon/etc/icon-chat.png";
import like from "@/assets/icon/like/icon-like-black-lg.png";
import star from "@/assets/icon/star/icon-star-active-lg.png";
import type { MoverWithReviewsProps } from "@/types/mover.types";

const MoverIntro = ({ mover }: MoverWithReviewsProps) => {
  const total = mover.reviewCount;
  const avg = mover.avgRating;
  const t = useTranslations("mover");
  return (
    <div>
      <div className="flex gap-2">
        {mover.serviceTypes.map((serviceType, idx) => (
          <MoveTypeLabel key={idx} type={getServiceTypeForLabel(serviceType.service?.name || "기타")} />
        ))}
      </div>
      <h2 className="text-2lg mt-2 mb-4 font-semibold md:mt-3 md:mb-5 md:text-2xl">{mover.description}</h2>
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
      <div className="flex items-center justify-center gap-9 rounded-xl border border-gray-200 px-[70px] py-[24.5px] md:gap-[97px] md:rounded-2xl md:py-8 lg:gap-42">
        <div className="flex w-full flex-col items-center">
          <p className="text-[13px] text-[#808080] md:mb-1 md:text-lg md:text-[#302F2D]">{t("inProgress")}</p>
          <p className="text-lg font-semibold md:text-xl md:font-bold">
            {mover.completedCount}
            {t("cases")}
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
            {t("years")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MoverIntro;
