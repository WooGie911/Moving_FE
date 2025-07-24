import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Providers from "./providers";
import { DevNavitgation } from "@/components/common/DevNavitgation";
import { Gnb } from "@/components/common/gnb/Gnb";
import Script from "next/script";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
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
        <Providers>
          <Gnb />
          {children}
          <DevNavitgation />
        </Providers>
      </body>
    </html>
  );
}
