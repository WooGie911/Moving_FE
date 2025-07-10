import { QuoteAndEstimates } from "@/components/quote/(my)/received/QuoteAndEstimates";
import React from "react";

const UserReceivedQuotePage = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-7 bg-[#fafafa] px-6 pt-8 pb-6 md:gap-10 md:px-7 md:pb-8 lg:gap-14 lg:px-10 lg:pt-11 lg:pb-9">
      <QuoteAndEstimates />
      <QuoteAndEstimates />
      <QuoteAndEstimates />
    </div>
  );
};

export default UserReceivedQuotePage;
