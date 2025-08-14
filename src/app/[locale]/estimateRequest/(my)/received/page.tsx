import { Metadata } from "next";
import UserReceivedEstimateRequestPage from "@/pageComponents/estimateRequest/(my)/received/UserReceivedEstimateRequestPage";
import { getMessages } from "next-intl/server";
import React from "react";

// 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  try {
    const messages = await getMessages({ locale });
    const estimateRequestMessages = messages.estimateRequest as any;
    const receivedMetadata = estimateRequestMessages?.metadata?.received;

    const title = receivedMetadata?.title || "받은 견적 | Moving";
    const description =
      receivedMetadata?.description ||
      "완료된 이사 견적을 확인하고 리뷰를 작성하세요. 과거 이사 기록을 관리할 수 있습니다.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/received`,
        siteName: "Moving",
        images: [
          {
            url: "https://gomoving.site/og-image.png",
            width: 1200,
            height: 630,
            alt: "Moving - 이사 서비스 플랫폼",
          },
        ],
        locale: locale,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ["https://gomoving.site/og-image.png"],
      },
      robots: {
        index: false, // 로그인이 필요한 개인 페이지이므로 인덱싱 방지
        follow: false,
      },
    };
  } catch (error) {
    console.error("메타데이터 생성 중 오류:", error);

    // 기본 메타데이터 반환
    return {
      title: "받은 견적 | Moving",
      description: "완료된 이사 견적을 확인하고 리뷰를 작성하세요. 과거 이사 기록을 관리할 수 있습니다.",
      openGraph: {
        title: "받은 견적 | Moving",
        description: "완료된 이사 견적을 확인하고 리뷰를 작성하세요. 과거 이사 기록을 관리할 수 있습니다.",
        type: "website",
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/received`,
        siteName: "Moving",
        images: [
          {
            url: "https://gomoving.site/og-image.png",
            width: 1200,
            height: 630,
            alt: "Moving - 이사 서비스 플랫폼",
          },
        ],
      },
      robots: {
        index: false,
        follow: false,
      },
    };
  }
}

export default async function page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // 번역 데이터를 미리 로드하여 성능 최적화
  const messages = await getMessages({ locale });

  return <UserReceivedEstimateRequestPage locale={locale} messages={messages} />;
}
