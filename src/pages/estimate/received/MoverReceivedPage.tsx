import React from "react";
import { FilterAndSearchSection } from "@/components/estimate/received/FilterAndSearchSection";
import { mockQuoteResponseData } from "@/types/moverEstimate";
import { CardList } from "@/components/estimate/CardList";

export const MoverReceivedPage = () => {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center justify-center">
      {/* 최상단 탭 */}
      <div className="flex w-full justify-start px-6">
        <div className="text-2lg text-black-500 cursor-pointer py-4 font-bold whitespace-nowrap transition-colors">
          받은요청
        </div>
      </div>
      {/* 상단 인풋 영역 */}
      <FilterAndSearchSection />
      {/* 하단 견적 목록들 */}
      <div className="flex w-full flex-col items-center justify-center">
        <div className="mb-[66px] flex w-full flex-col items-center justify-center gap-4 pt-[35px] md:mb-[98px] md:pt-[42px] lg:mb-[122px] lg:grid lg:grid-cols-2 lg:items-start lg:gap-6 lg:pt-[78px]">
          {mockQuoteResponseData.map((item) => (
            <CardList key={item.id} data={item} isDesignated={true} isConfirmed={false} type="received" />
          ))}
        </div>
      </div>
    </div>
  );
};
