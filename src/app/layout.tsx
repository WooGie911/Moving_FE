import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./[locale]/providers";
import { DevNavitgation } from "@/components/common/DevNavitgation";
import { Gnb } from "@/components/common/gnb/Gnb";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import LanguageSync from "./[locale]/LanguageSync";

const pretendard = localFont({
  src: "../assets/font/PretendardVariable.woff2",
  display: "swap",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "무빙",
  description: "안전하고 신뢰할 수 있는 이사 서비스를 찾아보세요",
  openGraph: {
    title: "무빙 - 이사 서비스",
    description: "안전하고 신뢰할 수 있는 이사 서비스를 찾아보세요",
    type: "website",
    url: "https://gomoving.site",
    images: [
      {
        url: "https://gomoving.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "무빙 - 이사 서비스",
      },
    ],
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // 들어오는 `locale`이 유효한지 확인
  const { locale } = await params;

  // 유효하지 않은 locale인 경우 기본 locale 사용
  const validLocale = hasLocale(routing.locales, locale) ? locale : routing.locales[0];

  return (
    <html lang={validLocale}>
      <head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무빙" />
        <meta property="og:locale" content="ko_KR" />
        {/* 카카오톡 SDK 로드 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
          integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${pretendard.variable} antialiased`}>
        <NextIntlClientProvider>
          {/* 언어 동기화 */}
          <LanguageSync locale={validLocale} />
          <Providers>
            <Gnb />
            {children}
            {/* <DevNavitgation /> */}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
