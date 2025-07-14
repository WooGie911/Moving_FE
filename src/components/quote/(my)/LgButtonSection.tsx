import { Button } from "@/components/common/button/Button";
import React from "react";

export const LgButtonSection = ({ estimatePrice }: { estimatePrice: string }) => {
  return (
    <div className="hidden lg:block">
      <div className="flex flex-col items-start justify-center gap-7">
        <div>
          <p className="text-[18px] leading-[26px] font-semibold text-gray-300">견적가</p>
          <p className="text-black-300 text-[24px] leading-[32px] font-bold">100,000원</p>
        </div>
        <Button variant="solid" width="w-[320px]" height="h-[64px]" rounded="rounded-[16px]">
          견적 확정하기
        </Button>
      </div>
    </div>
  );
};
