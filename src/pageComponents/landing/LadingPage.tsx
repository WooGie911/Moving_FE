"use client";

import Image from "next/image";
import React, { useMemo } from "react";
import { useTranslations } from "next-intl";
import landingBgLg from "@/assets/img/landing/bg-lg.webp";
import landingBgMd from "@/assets/img/landing/bg-md.webp";
import landingBgSm from "@/assets/img/landing/bg-sm.webp";
import truck from "@/assets/img/landing/truck.webp";
import moveType from "@/assets/img/landing/move-type.webp";
import explainLg from "@/assets/img/landing/explain-img-lg.webp";
import explainMd from "@/assets/img/landing/explain-img-md.webp";
import explainSm from "@/assets/img/landing/explain-img-sm.webp";
import bottomLg from "@/assets/img/landing/bottom-lg.webp";
import bottomMd from "@/assets/img/landing/bottom-md.webp";
import bottomSm from "@/assets/img/landing/bottom-sm.webp";
import appIcon from "@/assets/img/landing/app-icon.webp";
import { useWindowWidth } from "@/hooks/useWindowWidth";

export const LandingPage = () => {
  const deviceType = useWindowWidth();
  const t = useTranslations("landing");

  const imageConfig = useMemo(() => {
    const isMobile = deviceType === "mobile";
    const isTablet = deviceType === "tablet";

    return {
      bgImg: isMobile ? landingBgSm : isTablet ? landingBgMd : landingBgLg,
      bottomImg: isMobile ? bottomSm : isTablet ? bottomMd : bottomLg,
      bannerImg: isMobile ? explainSm : isTablet ? explainMd : explainLg,
      truckSize: isMobile ? 100 : 160,
      moveTypeWidth: isMobile ? 400 : isTablet ? 677 : 693,
      imageQuality: isMobile ? 75 : 85,
    };
  }, [deviceType]);

  return (
    <div className="flex flex-col items-center">
      <div className="relative h-[313px] w-full sm:h-[405px]">
        <Image
          src={imageConfig.bgImg}
          alt="landing-upper-background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
          quality={imageConfig.imageQuality}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-gray-50">
          <Image src={truck} alt="truck-img" width={imageConfig.truckSize} className="truck-slide-in mb-3" priority />
          <p className="text-xl font-bold md:text-3xl">{t("title")}</p>
          <p className="md:text-2lg px-10 text-lg font-normal whitespace-pre-line">{t("subtitle")}</p>
        </div>
      </div>

      <div className="sm:flex sm:w-full sm:justify-center md:flex md:justify-center">
        <div className="mb-[61px] flex flex-col md:mb-[108.5px] lg:mt-[115px] lg:mb-[124.5px] lg:flex-row lg:items-center lg:justify-center">
          <p className="mt-[53px] mb-[34px] ml-8 text-xl font-bold whitespace-pre-line md:mt-[69px] md:mb-10 md:ml-0 md:text-3xl lg:mt-[53px] lg:mr-[175.25px] lg:mb-[34px] lg:ml-[32px]">
            {t("selectionProcess")}
          </p>
          <div className="overflow-hidden">
            <Image
              src={moveType}
              alt="move type"
              width={imageConfig.moveTypeWidth}
              className={`object-cover lg:pr-8 ${deviceType !== "mobile" ? "slow-pulse" : ""}`}
              priority
              quality={imageConfig.imageQuality}
              sizes="(max-width: 768px) 400px, (max-width: 1024px) 677px, 693px"
            />
          </div>
        </div>
      </div>

      <div className="relative flex">
        <Image
          src={imageConfig.bannerImg}
          alt="explain-banner"
          className="md:px-8 lg:mb-[61px] lg:max-w-[1200px]"
          priority
          quality={imageConfig.imageQuality}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
        />
        <p className="absolute top-[10%] right-[10%] flex max-w-[calc(100%-32px)] flex-col items-start text-end text-xl font-bold whitespace-pre-line text-white md:top-[7.3%] md:right-[11.5%] md:text-3xl lg:top-[16%] lg:left-[53.0%] lg:text-start">
          {t("getQuote")}
        </p>
      </div>

      <div className="relative flex">
        <Image src={imageConfig.bottomImg} alt="bottom-banner" quality={imageConfig.imageQuality} loading="lazy" />
        <p className="absolute top-[10%] left-[5%] flex w-full flex-col items-start text-xl font-bold whitespace-pre-line md:top-[7%] md:left-[4%] md:text-3xl lg:top-[10.3%] lg:left-[8%]">
          {t("learnMore")}
        </p>
      </div>

      <div className="bg-orange-gradient flex h-50 w-full flex-col items-center justify-center md:h-[311px] lg:h-[355px]">
        <Image src={appIcon} alt="app-icon" className="mb-3 w-[56px] md:mb-8 md:w-27" />
        <p className="text-center text-xl font-bold text-white md:text-[28px]">{t("complexMoving")}</p>
      </div>
    </div>
  );
};
