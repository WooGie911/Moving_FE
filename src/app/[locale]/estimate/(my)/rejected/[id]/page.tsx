import { Metadata } from "next";
import { MoverRejectedDetailPage } from "@/pageComponents/estimate/(my)/rejected/[id]/MoverRejectedDetailPage";
import { getMessages } from "next-intl/server";
import moverEstimateApi from "@/lib/api/moverEstimate.api";
import React from "react";

// 메타데이터 생성
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    const messages = await getMessages({ locale });
    const estimateMessages = messages.estimate as any;
    const detailMetadata = estimateMessages?.metadata?.detail;

    // API 호출로 견적 상세 정보 가져오기
    let estimateTitle = detailMetadata?.title || "견적 상세 | Moving";
    let estimateDescription =
      detailMetadata?.description || "견적 상세 정보를 확인하고 고객과 소통하세요. 이사 견적을 자세히 관리하세요.";

    try {
      // 반려된 견적 데이터 가져오기
      const rejectedData = await moverEstimateApi.getMyRejectedEstimateRequests(locale);

      if (rejectedData && Array.isArray(rejectedData)) {
        const foundEstimate = rejectedData.find((item: any) => item.id === id);

        if (foundEstimate && foundEstimate.estimateRequest) {
          // 동적 제목과 설명 생성
          const moveType = foundEstimate.estimateRequest.moveType;
          const fromAddress = foundEstimate.estimateRequest.fromAddress
            ? `${foundEstimate.estimateRequest.fromAddress.city} ${foundEstimate.estimateRequest.fromAddress.district}`.trim()
            : "출발지";
          const toAddress = foundEstimate.estimateRequest.toAddress
            ? `${foundEstimate.estimateRequest.toAddress.city} ${foundEstimate.estimateRequest.toAddress.district}`.trim()
            : "도착지";
          const customerName = foundEstimate.estimateRequest.customer?.name || "고객";

          estimateTitle = `${customerName}님 반려된 견적 | Moving`;
          estimateDescription = `${fromAddress}에서 ${toAddress}로의 ${moveType} 이사 견적이 반려되었습니다. 반려 사유를 확인하고 개선점을 파악하세요.`;
        }
      }
    } catch (apiError) {
      console.error("견적 데이터 조회 실패:", apiError);
      // API 실패 시 기본 메타데이터 사용
    }

    return {
      title: estimateTitle,
      description: estimateDescription,
      openGraph: {
        title: estimateTitle,
        description: estimateDescription,
        type: "website",
        url: `https://gomoving.site/${locale}/estimate/(my)/rejected/${id}`,
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
        title: estimateTitle,
        description: estimateDescription,
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
      title: "반려된 견적 상세 | Moving",
      description: "반려된 견적의 상세 정보를 확인하고 개선점을 파악하세요. 향후 견적 개선에 활용하세요.",
      openGraph: {
        title: "반려된 견적 상세 | Moving",
        description: "반려된 견적의 상세 정보를 확인하고 개선점을 파악하세요. 향후 견적 개선에 활용하세요.",
        type: "website",
        url: `https://gomoving.site/${locale}/estimate/(my)/rejected/${id}`,
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
  return <MoverRejectedDetailPage />;
}
