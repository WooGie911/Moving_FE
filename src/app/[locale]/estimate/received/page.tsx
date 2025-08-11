import { Metadata } from "next";
import { MoverReceivedPage } from "@/pageComponents/estimate/received/MoverReceivedPage";
import { getMessages } from "next-intl/server";
import React from "react";

// 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;

  try {
    const messages = await getMessages({ locale });
    const estimateMessages = messages.estimate as any;
    const receivedMetadata = estimateMessages?.metadata?.received;

    const title = receivedMetadata?.title || "받은 견적 | Moving";
    const description =
      receivedMetadata?.description ||
      "고객으로부터 받은 이사 견적 요청을 확인하고 견적을 보내세요. 새로운 이사 의뢰를 관리하세요.";

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        url: `https://gomoving.site/${locale}/estimate/received`,
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
      description: "고객으로부터 받은 이사 견적 요청을 확인하고 견적을 보내세요. 새로운 이사 의뢰를 관리하세요.",
      openGraph: {
        title: "받은 견적 | Moving",
        description: "고객으로부터 받은 이사 견적 요청을 확인하고 견적을 보내세요. 새로운 이사 의뢰를 관리하세요.",
        type: "website",
        url: `https://gomoving.site/${locale}/estimate/received`,
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

export default function page() {
  return <MoverReceivedPage />;
}
