import React, { useState } from "react";
import Chip from "./Chip";
import MoverIntro from "./MoverIntro";
import ReviewAvg from "./ReviewAvg";
import ReviewList from "./ReviewList";
import RequestButton from "./RequestButton";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ShareButtonGroup } from "@/components/common/button/ShareButtonGroup";
import { MoverProps } from "@/types/moverDetail";

const DetailInformation = ({ mover }: MoverProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const deviceType = useWindowWidth();

  return (
    <div
      className={`mt-[35px] ${deviceType === "desktop" ? "flex justify-center gap-[116px]" : "flex flex-col items-center"} w-full px-5 md:mt-[46px] md:px-18 lg:mt-[62px] lg:px-[20px]`}
    >
      <div>
        <div>
          <MoverIntro mover={mover} reviews={reviews} />
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
              <p className="text-lg font-semibold">나만 알기엔 아쉬운 기사님 이신가요?</p>
              <ShareButtonGroup />
            </div>
            <div className="mt-8 mb-8 h-[1px] w-full border border-[#F2F2F2] lg:mt-10 lg:mb-10"></div>
          </>
        )}

        <ReviewAvg mover={mover} reviews={reviews} />

        <ReviewList moverId={mover.id} onReviewsFetched={setReviews} />
      </div>
      <div className="flex w-full flex-col lg:w-80 lg:gap-[22px]">
        <RequestButton mover={mover} />
        {deviceType === "desktop" ? <ShareButtonGroup /> : ""}
      </div>
    </div>
  );
};

export default DetailInformation;
