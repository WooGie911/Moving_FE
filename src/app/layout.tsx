import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="무빙" />
        <meta property="og:locale" content="ko_KR" />

        {/* 구조화된 데이터 - 알림 기능 */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "무빙",
              description: "안전하고 신뢰할 수 있는 이사 서비스를 찾아보세요",
              url: "https://gomoving.site",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              featureList: ["실시간 알림 서비스", "이사 견적 요청", "이사업체 검색", "고객 리뷰 시스템"],
              offers: {
                "@type": "Offer",
                category: "이사 서비스",
              },
            }),
          }}
        />

        {/* 카카오톡 SDK 로드 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.7.5/kakao.min.js"
          integrity="sha384-dok87au0gKqJdxs7msEdBPNnKSRT+/mhTVzq+qOhcL464zXwvcrpjeWvyj1kCdq6"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${pretendard.variable} antialiased`}>{children}</body>
    </html>
  );
}
