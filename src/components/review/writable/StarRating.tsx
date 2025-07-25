"use client";

import star_active from "@/assets/icon/star/icon-star-active-sm.png";
import star_inactive from "@/assets/icon/star/icon-star-inactive-sm.png";
import Image from "next/image";

type StarRatingProps = {
  rating: number;
  setRating: (rating: number) => void;
};

const StarRating = ({ rating, setRating }: StarRatingProps) => {
  const handleStarClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);
  };

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3">
        <p className="text-black-300 text-[16px] font-semibold lg:text-[18px]">평점을 선택해 주세요</p>
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
