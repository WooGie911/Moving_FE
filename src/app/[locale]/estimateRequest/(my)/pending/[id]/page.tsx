import { Metadata } from "next";
import UserPendingEstimateRequestDetailPage from "@/pageComponents/estimateRequest/(my)/pending/[id]/UserPendingEstimateRequestDetailPage";
import { getMessages } from "next-intl/server";
import customerEstimateRequestApi from "@/lib/api/customerEstimateRequest.api";
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
    const estimateRequestMessages = messages.estimateRequest as any;
    const detailMetadata = estimateRequestMessages?.metadata?.detail;

    // API 호출로 견적 상세 정보 가져오기
    let estimateTitle = detailMetadata?.title || "견적 상세 | Moving";
    let estimateDescription =
      detailMetadata?.description || "견적 상세 정보를 확인하고 업체와 소통하세요. 이사 견적을 자세히 살펴보세요.";

    try {
      // 견적 요청 데이터 가져오기
      const estimateData = await customerEstimateRequestApi.getPendingEstimateRequest(locale);

      if (estimateData?.estimateRequest && estimateData?.estimates) {
        const estimate = estimateData.estimates.find((est: any) => est.id === id);
        const estimateRequest = estimateData.estimateRequest;

        if (estimate && estimateRequest) {
          // 동적 제목과 설명 생성
          const moveType = estimateRequest.moveType;
          const fromAddress = estimateRequest.fromAddress
            ? `${estimateRequest.fromAddress.city} ${estimateRequest.fromAddress.district}`.trim()
            : "출발지";
          const toAddress = estimateRequest.toAddress
            ? `${estimateRequest.toAddress.city} ${estimateRequest.toAddress.district}`.trim()
            : "도착지";
          const moverName = estimate.mover?.nickname || estimate.mover?.name || "업체";

          estimateTitle = `${moverName} 견적 상세 | Moving`;
          estimateDescription = `${fromAddress}에서 ${toAddress}로의 ${moveType} 이사 견적을 확인하세요. ${moverName}의 상세한 견적 정보와 서비스를 살펴보세요.`;
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
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/pending/${id}`,
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
      title: "견적 상세 | Moving",
      description: "견적 상세 정보를 확인하고 업체와 소통하세요. 이사 견적을 자세히 살펴보세요.",
      openGraph: {
        title: "견적 상세 | Moving",
        description: "견적 상세 정보를 확인하고 업체와 소통하세요. 이사 견적을 자세히 살펴보세요.",
        type: "website",
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/pending/${id}`,
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
  return <UserPendingEstimateRequestDetailPage />;
}
