"use client";
import React, { useState, useEffect } from "react";
import star_active from "@/assets/icon/star/icon-star-active-sm.png";
import star_inactive from "@/assets/icon/star/icon-star-inactive-sm.png";

<<<<<<< HEAD
import Image from "next/image";

const StarRating = () => {
  const [rating, setRating] = useState<number>(0);
  // 별점 이 컴포넌트 밖으로 넘겨주는건 재육님이 하셈
  const handleStarClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);
    console.log("클릭한 별 인덱스:", starIndex, "새로운 별점:", newRating);
  };

  // rating 상태가 변경될 때마다 실행
  useEffect(() => {
    console.log("별점 상태 업데이트됨:", rating);
  }, [rating]);

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3 bg-[#fafafa]">
        <p className="text-black-300 lg :text-[18px] text-[16px] leading-[26px] font-semibold">평점을 선택해 주세요</p>
        <div className="flex flex-row items-center justify-start gap-[2px] md:gap-[0px]">
          {[0, 1, 2, 3, 4].map((index) => (
            <button
              key={index}
              className="relative h-[24px] w-[24px] cursor-pointer hover:scale-105 lg:h-[36px] lg:w-[36px]"
              onClick={() => handleStarClick(index)}
            >
              <Image
                src={index < rating ? star_active : star_inactive}
                alt="star"
                fill
                className="object-contain p-[2px] lg:p-[3px]"
              />
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StarRating;
=======
export default function page() {
  return <div>완료된 견적 페이지</div>;
}
>>>>>>> f665fa47731c56049f6094d1db2fa4e6f439a985
