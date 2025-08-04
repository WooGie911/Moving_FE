import React from "react";
import Image from "next/image";
import CarLg from "@/assets/img/etc/car-lg.png";

export default function Loading() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center"
      role="main"
      aria-live="polite"
      aria-busy="true"
    >
      {/* 트럭이 움직이는 애니메이션 컨테이너 */}
      <section className="relative w-full max-w-md overflow-hidden" aria-label="로딩 애니메이션">
        {/* 도로 배경 */}
        <div className="absolute right-0 bottom-0 left-0 h-3 rounded-full bg-gray-300" role="presentation"></div>

        {/* 트럭 이미지 */}
        <figure className="animate-truck-move relative">
          <Image
            src={CarLg}
            alt="움직이는 트럭"
            width={120}
            height={90}
            className="h-24 w-24 object-contain"
            role="img"
          />
        </figure>

        {/* 먼지 효과 */}
        <div className="absolute right-0 bottom-3 left-0 flex justify-center" role="presentation" aria-hidden="true">
          <div className="animate-dust-1 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
          <div className="animate-dust-2 mx-1 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
          <div className="animate-dust-3 h-1 w-1 rounded-full bg-gray-400 opacity-60"></div>
        </div>
      </section>

      {/* 로딩 텍스트 */}
      <article className="mt-6">
        <p className="animate-pulse text-base font-medium text-gray-600" role="status" aria-label="현재 페이지 로딩 중">
          페이지를 불러오는 중...
        </p>
      </article>
    </main>
  );
}
