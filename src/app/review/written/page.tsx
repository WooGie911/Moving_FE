import React from "react";
import ReviewCard from "@/components/review/written/ReviewCard";

export default function page() {
  return (
    <div>
      <div>{/* 헤더영역 */}</div>
      <div className="mx-auto w-[327px] md:w-147 lg:w-280">
        <ReviewCard />
      </div>
    </div>
  );
}
