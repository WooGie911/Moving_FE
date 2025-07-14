"use client";
import Image from "next/image";
import React from "react";
import share from "@/assets/icon/clip/icon-clip.png";
import kakaohare from "@/assets/icon/share/icon-share-kakao-sm.png";
import facebookshare from "@/assets/icon/share/icon-share-facebook-sm.png";

export const ShareSection = () => {
  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3 py-3 lg:gap-[22px]">
        <p className="text-black-400 text-[16px] leading-[32px] font-semibold md:text-[20px] lg:hidden">
          나만 알기엔 아쉬운 기사님 인가요?
        </p>
        <p className="text-black-400 hidden text-[16px] leading-[32px] font-semibold md:text-[20px] lg:block">
          견적서 공유하기
        </p>

        <div className="flex w-full flex-row items-center justify-start gap-3 md:gap-4">
          <button
            className="border-border-light flex h-10 w-10 cursor-pointer flex-row items-center justify-center rounded-[8px] border-1 lg:h-16 lg:w-16 lg:rounded-[16px]"
            onClick={() => console.log("공유하기 연결")}
          >
            <div className="relative h-6 w-6 lg:h-9 lg:w-9">
              <Image src={share} alt="share" fill />
            </div>
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer lg:h-16 lg:w-16"
            onClick={() => console.log("공유하기 연결")}
          >
            <Image src={kakaohare} alt="kakaohare" fill />
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer lg:h-16 lg:w-16"
            onClick={() => console.log("공유하기 연결")}
          >
            <Image src={facebookshare} alt="facebookshare" fill />
          </button>
        </div>
      </div>
    </>
  );
};
