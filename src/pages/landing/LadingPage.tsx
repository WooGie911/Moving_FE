"use client";

import Image from "next/image";
import React from "react";
import landingBgLg from "@/assets/img/landing/bg-lg.png";
import landingBgMd from "@/assets/img/landing/bg-md.png";
import landingBgSm from "@/assets/img/landing/bg-sm.png";
import truck from "@/assets/img/landing/truck.png";
import typeLg from "@/assets/img/landing/type-lg.png";
import typeMd from "@/assets/img/landing/type-md.svg";
import typeSm from "@/assets/img/landing/type-sm.png";
import explainLg from "@/assets/img/landing/explain-img-lg.png";
import explainMd from "@/assets/img/landing/explain-img-md.svg";
import explainSm from "@/assets/img/landing/explain-img-sm.svg";
import bottomLg from "@/assets/img/landing/bottom-lg.png";
import bottomMd from "@/assets/img/landing/bottom-md.png";
import bottomSm from "@/assets/img/landing/bottom-sm.png";
import appIcon from "@/assets/img/landing/app-icon.svg";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export const LandingPage = () => {
  const deviceType = useWindowWidth();
  let bgImg = landingBgSm;
  if (deviceType === "tablet") bgImg = landingBgMd;
  else if (deviceType === "desktop") bgImg = landingBgLg;

  let moveTypeImg = typeSm;
  if (deviceType === "tablet") moveTypeImg = typeMd;
  else if (deviceType === "desktop") moveTypeImg = typeLg;

  let bottomImg = bottomSm;
  if (deviceType === "tablet") bottomImg = bottomMd;
  else if (deviceType === "desktop") bottomImg = bottomLg;

  let bannerImg = explainSm;
  if (deviceType === "tablet") bannerImg = explainMd;
  else if (deviceType === "desktop") bannerImg = explainLg;

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[313px] w-full sm:h-[405px]">
        <Image src={bgImg} alt="landing-upper-background" fill className="object-cover" priority />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-gray-50">
          <Image src={truck} alt="truck-img" className="truck-slide-in mb-3 w-25 sm:w-40" />{" "}
          <p className="text-xl font-bold md:text-3xl">이사업체, 어떻게 고르세요?</p>
          <p className="md:text-2lg text-lg font-normal">
            무빙은 여러 견적을 한눈에 비교해
            <br />
            이사업체 선정 과정을 간편하게 바꿔드려요
          </p>
        </div>
      </div>

      <div className="mb-[61px] flex flex-col md:mb-[108.5px] lg:mt-[115px] lg:mb-[124.5px] lg:flex-row lg:items-center lg:justify-center">
        <p className="mt-[53px] mb-[34px] ml-8 text-xl font-bold md:mt-[69px] md:mb-10 md:text-3xl lg:mt-[53px] lg:mr-[175.25px] lg:mb-[34px] lg:ml-[32px]">
          <span className="block lg:mb-2">번거로운 선정과정,</span>
          <span className="block">이사 유형부터 선택해요</span>
        </p>
        <div className="overflow-hidden">
          <Image src={moveTypeImg} alt="move type" className="slow-pulse object-cover" />
        </div>
      </div>

      <div className="relative flex">
        <Image src={bannerImg} alt="explain-banner" className="lg:mb-[61px]" />
        <p className="absolute top-[5%] right-[10%] flex max-w-[calc(100%-32px)] flex-col items-start text-end text-xl font-bold text-white md:top-[7.3%] md:right-[11.5%] md:text-3xl lg:top-[20.3%] lg:left-[54.5%]">
          원하는 이사 서비스를 요청하고
          <br />
          견적을 받아보세요
        </p>
      </div>

      <div className="relative flex">
        <Image src={bottomImg} alt="bottom-banner" />
        <p className="absolute top-[10%] left-[5%] flex max-w-[calc(100%-32px)] flex-col items-start text-xl font-bold md:top-[7%] md:left-[4%] md:text-3xl lg:top-[10.3%] lg:left-[20%]">
          여러 업체의 견적을 <br />
          한눈에 비교하고 선택해요
        </p>
      </div>

      <div className="bg-orange-gradient flex h-50 w-full flex-col items-center justify-center md:h-[311px] lg:h-[355px]">
        <Image src={appIcon} alt="app-icon" className="mb-3 w-[56px] md:mb-8 md:w-27" />
        <p className="text-center text-xl font-bold text-white md:text-[28px]">
          {deviceType === "mobile" ? (
            <>
              복잡한 이사 준비,
              <br />
              무빙 하나면 끝!
            </>
          ) : (
            "복잡한 이사 준비, 무빙 하나면 끝!"
          )}
        </p>
      </div>
    </div>
  );
};
