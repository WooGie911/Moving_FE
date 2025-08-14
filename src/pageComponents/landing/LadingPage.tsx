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
    <>
      {/* 스킵 링크 - 웹 접근성을 위한 키보드 네비게이션 */}
      <nav className="sr-only focus-within:not-sr-only" aria-label="빠른 이동 메뉴">
        <a
          href="#main-content"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          본문으로 바로가기
        </a>
        <a
          href="#selection-content"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 ml-2 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          서비스 안내로 바로가기
        </a>
      </nav>

      <main id="main-content" className="flex flex-col items-center">
        <header className="relative h-[313px] w-full sm:h-[405px]" aria-labelledby="hero-title" role="banner">
          <picture>
            <source media="(min-width: 1024px)" srcSet={landingBgLg.src} />
            <source media="(min-width: 768px)" srcSet={landingBgMd.src} />
            <Image
              src={landingBgSm}
              alt="무빙 서비스 메인 배경 - 이사 서비스를 나타내는 이미지"
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
              alt="이사 트럭 일러스트 - 무빙 서비스를 상징하는 아이콘"
              width={160}
              height={160}
              className="truck-slide-in mb-3"
              priority
              sizes="160px"
              role="img"
              aria-describedby="truck-description"
            />
            <span id="truck-description" className="sr-only">
              무빙 서비스의 상징인 이사 트럭 이미지입니다.
            </span>
            <h1 id="hero-title" className="text-xl font-bold md:text-3xl" role="heading" aria-level={1}>
              {t("title")}
            </h1>
            <p
              className="md:text-2lg px-10 text-lg font-normal whitespace-pre-line"
              role="text"
              aria-describedby="hero-title"
            >
              {t("subtitle")}
            </p>
          </div>
        </header>

        <article
          id="selection-content"
          className="sm:flex sm:w-full sm:justify-center md:flex md:justify-center"
          aria-labelledby="selection-title"
          role="region"
        >
          <div className="mb-[61px] flex flex-col md:mb-[108.5px] lg:mt-[115px] lg:mb-[124.5px] lg:flex-row lg:items-center lg:justify-center">
            <header>
              <h2
                id="selection-title"
                className="mt-[53px] mb-[34px] ml-8 text-xl font-bold whitespace-pre-line md:mt-[69px] md:mb-10 md:ml-0 md:text-3xl lg:mt-[53px] lg:mr-[175.25px] lg:mb-[34px] lg:ml-[32px]"
                role="heading"
                aria-level={2}
              >
                {t("selectionProcess")}
              </h2>
            </header>
            <figure className="overflow-hidden" role="img" aria-labelledby="selection-title">
              <picture>
                <source media="(min-width: 1024px)" srcSet={moveType.src} />
                <source media="(min-width: 768px)" srcSet={moveType.src} />
                <Image
                  src={moveType}
                  alt="서비스 선택 과정을 보여주는 단계별 안내 이미지 - 1단계부터 4단계까지의 이사 서비스 이용 방법"
                  width={693}
                  height={400}
                  className="slow-pulse object-cover lg:pr-8"
                  priority
                  quality={75}
                  sizes="(max-width: 768px) 400px, (max-width: 1024px) 677px, 693px"
                  role="img"
                  aria-describedby="selection-description"
                />
              </picture>
              <figcaption id="selection-description" className="sr-only">
                무빙 서비스 이용 과정을 4단계로 나누어 설명하는 인포그래픽입니다.
              </figcaption>
            </figure>
          </div>
        </article>

        <section className="relative flex" aria-labelledby="quote-title" role="region">
          <picture>
            <source media="(min-width: 1024px)" srcSet={explainLg.src} />
            <source media="(min-width: 768px)" srcSet={explainMd.src} />
            <Image
              src={explainSm}
              alt="견적 요청 안내 배너 - 간편하고 빠른 견적 요청 서비스를 설명하는 이미지"
              className="md:px-8 lg:mb-[61px] lg:max-w-[1200px]"
              priority
              quality={75}
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 1200px"
              role="img"
              aria-describedby="quote-description"
            />
          </picture>
          <div className="absolute top-[10%] right-[10%] flex max-w-[calc(100%-32px)] flex-col items-start text-end md:top-[7.3%] md:right-[11.5%] lg:top-[16%] lg:left-[53.0%] lg:text-start">
            <h3
              id="quote-title"
              className="text-xl font-bold whitespace-pre-line text-white md:text-3xl"
              role="heading"
              aria-level={3}
            >
              {t("getQuote")}
            </h3>
            <span id="quote-description" className="sr-only">
              무빙에서 간편하게 견적을 요청하고 최고의 이사 서비스를 경험해보세요.
            </span>
          </div>
        </section>

        <section className="relative flex" aria-labelledby="info-title" role="region">
          <picture>
            <source media="(min-width: 1024px)" srcSet={bottomLg.src} />
            <source media="(min-width: 768px)" srcSet={bottomMd.src} />
            <Image
              src={bottomSm}
              alt="자세한 정보 안내 배너 - 무빙 서비스에 대한 추가 정보를 제공하는 이미지"
              quality={75}
              loading="lazy"
              sizes="100vw"
              role="img"
              aria-describedby="info-description"
            />
          </picture>
          <div className="absolute top-[10%] left-[5%] flex w-full flex-col items-start md:top-[7%] md:left-[4%] lg:top-[10.3%] lg:left-[8%]">
            <h3
              id="info-title"
              className="text-xl font-bold whitespace-pre-line md:text-3xl"
              role="heading"
              aria-level={3}
            >
              {t("learnMore")}
            </h3>
            <span id="info-description" className="sr-only">
              무빙 서비스에 대한 더 자세한 정보와 이용 방법을 확인하실 수 있습니다.
            </span>
          </div>
        </section>

        <aside
          className="bg-orange-gradient flex h-50 w-full flex-col items-center justify-center md:h-[311px] lg:h-[355px]"
          aria-labelledby="app-download-title"
          role="complementary"
        >
          <Image
            src={appIcon}
            alt="무빙 앱 아이콘 - 모바일 애플리케이션 다운로드"
            className="mb-3 w-[56px] md:mb-8 md:w-27"
            width={56}
            height={56}
            sizes="56px"
            role="img"
            aria-describedby="app-description"
          />
          <h3
            id="app-download-title"
            className="text-center text-xl font-bold text-white md:text-[28px]"
            role="heading"
            aria-level={3}
          >
            {t("complexMoving")}
          </h3>
          <span id="app-description" className="sr-only">
            무빙 모바일 앱을 다운로드하여 더 편리하게 이사 서비스를 이용하세요.
          </span>
        </aside>
      </main>
    </>
  );
};
