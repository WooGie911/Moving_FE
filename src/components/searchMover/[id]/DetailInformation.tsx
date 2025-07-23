import React, { useState } from "react";
import Chip from "./Chip";
import MoverIntro from "./MoverIntro";
import ReviewAvg from "./ReviewAvg";
import ReviewList from "./ReviewList";
import RequestButton from "./RequestButton";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ShareButtonGroup } from "@/components/common/button/ShareButtonGroup";
import type { DetailInformationProps } from "@/types/mover.types";
import estimateRequestApi from "@/lib/api/estimateRequest.api";

const DetailInformation = ({ mover, onMoverUpdate }: DetailInformationProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [quoteId, setQuoteId] = useState<string | undefined>(undefined);
  const [isLoadingQuote, setIsLoadingQuote] = useState(true);
  const deviceType = useWindowWidth();

  React.useEffect(() => {
    const fetchActiveQuote = async () => {
      try {
        setIsLoadingQuote(true);
        const response = await estimateRequestApi.getActive();

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
  }, []);

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
        {isLoadingQuote ? (
          <div className="flex items-center justify-center py-4">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600"></div>
          </div>
        ) : (
          <RequestButton mover={mover} quoteId={quoteId} onMoverUpdate={onMoverUpdate} />
        )}
        {deviceType === "desktop" ? <ShareButtonGroup /> : ""}
      </div>
    </div>
  );
};

export default DetailInformation;
