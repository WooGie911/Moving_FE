"use client";
import star_active from "@/assets/icon/star/icon-star-active-sm.webp";
import star_inactive from "@/assets/icon/star/icon-star-inactive-sm.webp";
import Image from "next/image";
import { useTranslations } from "next-intl";

type TStarRatingProps = {
  rating: number;
  setRating: (rating: number) => void;
};

const StarRating = ({ rating, setRating }: TStarRatingProps) => {
  const t = useTranslations("review");

  const handleStarClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);
  };

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3">
        <p className="text-black-300 text-[16px] font-semibold lg:text-[18px]">{t("selectRating")}</p>
        <div>
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              type="button"
              className="relative h-[28px] w-[28px] cursor-pointer lg:h-[36px] lg:w-[36px]"
              onClick={() => handleStarClick(index)}
            >
              <Image src={index < rating ? star_active : star_inactive} alt="star" fill />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StarRating;
