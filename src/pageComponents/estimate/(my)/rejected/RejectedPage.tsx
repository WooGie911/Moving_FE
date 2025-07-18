import { QuoteAndEstimateTab } from "@/components/common/tab/QuoteAndEstimateTab";
import { CardList } from "@/components/estimate/CardList";
import { mockQuoteResponseData } from "@/types/moverEstimate";
import React from "react";

export const RejectedPage = () => {
  return (
    <div>
      <QuoteAndEstimateTab userType="Mover" />
      <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
        <div className="flex w-full flex-col items-center justify-center">
          <div className="mb-[66px] flex w-full max-w-[1200px] flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
            {mockQuoteResponseData.map((item) => (
              <CardList
                key={item.id}
                data={item}
                id={item.id}
                isDesignated={false}
                isConfirmed={false}
                type="rejected"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
