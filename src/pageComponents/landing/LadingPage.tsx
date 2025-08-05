import Image from "next/image";
import React from "react";
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

export const LandingPage = () => {
  const t = useTranslations("landing");

  return (
    <main className="flex flex-col items-center" role="main">
      <section className="relative h-[313px] w-full sm:h-[405px]" aria-label="메인 배너">
        <picture>
          <source media="(min-width: 1024px)" srcSet={landingBgLg.src} />
          <source media="(min-width: 768px)" srcSet={landingBgMd.src} />
          <Image
            src={landingBgSm}
            alt="무빙 서비스 메인 배경"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
        </picture>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center text-gray-50">
          <Image
            src={truck}
            alt="트럭 아이콘"
            width={160}
            height={160}
            className="truck-slide-in mb-3"
            priority
            sizes="160px"
          />
          <h1 className="text-xl font-bold md:text-3xl">{t("title")}</h1>
          <p className="md:text-2lg px-10 text-lg font-normal whitespace-pre-line">{t("subtitle")}</p>
        </div>
      </section>

      <section className="sm:flex sm:w-full sm:justify-center md:flex md:justify-center" aria-label="서비스 선택 과정">
        <div className="mb-[61px] flex flex-col md:mb-[108.5px] lg:mt-[115px] lg:mb-[124.5px] lg:flex-row lg:items-center lg:justify-center">
          <h2 className="mt-[53px] mb-[34px] ml-8 text-xl font-bold whitespace-pre-line md:mt-[69px] md:mb-10 md:ml-0 md:text-3xl lg:mt-[53px] lg:mr-[175.25px] lg:mb-[34px] lg:ml-[32px]">
            {t("selectionProcess")}
          </h2>
          <div className="overflow-hidden">
            <picture>
              <source media="(min-width: 1024px)" srcSet={moveType.src} />
              <source media="(min-width: 768px)" srcSet={moveType.src} />
              <Image
                src={moveType}
                alt="서비스 선택 과정 이미지"
                width={693}
                height={400}
                className="slow-pulse object-cover lg:pr-8"
                priority
                quality={75}
                sizes="(max-width: 768px) 400px, (max-width: 1024px) 677px, 693px"
              />
            </picture>
          </div>
        </div>
      </section>

      <section className="relative flex" aria-label="견적 요청 안내">
        <picture>
          <source media="(min-width: 1024px)" srcSet={explainLg.src} />
          <source media="(min-width: 768px)" srcSet={explainMd.src} />
          <Image
            src={explainSm}
            alt="견적 요청 안내 배너"
            className="md:px-8 lg:mb-[61px] lg:max-w-[1200px]"
            priority
            quality={75}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
          />
        </picture>
        <p className="absolute top-[10%] right-[10%] flex max-w-[calc(100%-32px)] flex-col items-start text-end text-xl font-bold whitespace-pre-line text-white md:top-[7.3%] md:right-[11.5%] md:text-3xl lg:top-[16%] lg:left-[53.0%] lg:text-start">
          {t("getQuote")}
        </p>
      </section>

      <section className="relative flex" aria-label="자세한 정보">
        <picture>
          <source media="(min-width: 1024px)" srcSet={bottomLg.src} />
          <source media="(min-width: 768px)" srcSet={bottomMd.src} />
          <Image src={bottomSm} alt="자세한 정보 배너" quality={75} loading="lazy" sizes="100vw" />
        </picture>
        <p className="absolute top-[10%] left-[5%] flex w-full flex-col items-start text-xl font-bold whitespace-pre-line md:top-[7%] md:left-[4%] md:text-3xl lg:top-[10.3%] lg:left-[8%]">
          {t("learnMore")}
        </p>
      </section>

      <section
        className="bg-orange-gradient flex h-50 w-full flex-col items-center justify-center md:h-[311px] lg:h-[355px]"
        aria-label="앱 다운로드"
      >
        <Image
          src={appIcon}
          alt="앱 아이콘"
          className="mb-3 w-[56px] md:mb-8 md:w-27"
          width={56}
          height={56}
          sizes="56px"
        />
        <p className="text-center text-xl font-bold text-white md:text-[28px]">{t("complexMoving")}</p>
      </section>
    </main>
  );
};
