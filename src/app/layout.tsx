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
  title: {
    default: "무빙 - 믿을 수 있는 이사 서비스 플랫폼",
    template: "%s | 무빙",
  },
  description:
    "전국 최고의 이사 전문가들과 함께하세요. 견적 비교부터 예약까지 한 번에! 안전하고 저렴한 이사 서비스를 무빙에서 만나보세요.",
  keywords: [
    "이사",
    "이사업체",
    "이사견적",
    "포장이사",
    "반포장이사",
    "이사비용",
    "이사서비스",
    "무빙",
    "moving",
    "이사예약",
    "이사전문가",
  ],
  authors: [{ name: "무빙팀" }],
  creator: "무빙",
  publisher: "무빙",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "무빙 - 믿을 수 있는 이사 서비스 플랫폼",
    description: "전국 최고의 이사 전문가들과 함께하세요. 견적 비교부터 예약까지 한 번에!",
    type: "website",
    url: "https://gomoving.site",
    siteName: "무빙",
    locale: "ko_KR",
    images: [
      {
        url: "https://gomoving.site/og-image.png",
        width: 1200,
        height: 630,
        alt: "무빙 - 이사 서비스 플랫폼",
        type: "image/png",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://gomoving.site",
    languages: {
      "ko-KR": "https://gomoving.site/ko",
      "en-US": "https://gomoving.site/en",
      "zh-CN": "https://gomoving.site/zh",
    },
  },
  category: "service",
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
