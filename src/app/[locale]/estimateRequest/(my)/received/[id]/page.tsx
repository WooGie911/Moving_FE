import { Metadata } from "next";
import { UserReceivedEstimateRequestDetailPage } from "@/pageComponents/estimateRequest/(my)/received/[id]/UserReceivedEstimateRequestDetailPage";
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
      // 완료된 견적 요청 데이터 가져오기
      const receivedData = await customerEstimateRequestApi.getReceivedEstimateRequests(locale);

      if (receivedData && Array.isArray(receivedData)) {
        // 해당 estimateId를 가진 견적 찾기
        let foundEstimateRequest = null;
        let foundEstimate = null;

        for (const item of receivedData) {
          const match = item.estimates.find((est: any) => est.id === id);
          if (match) {
            foundEstimateRequest = item.estimateRequest;
            foundEstimate = match;
            break;
          }
        }

        if (foundEstimate && foundEstimateRequest) {
          // 동적 제목과 설명 생성
          const moveType = foundEstimateRequest.moveType;
          const fromAddress = foundEstimateRequest.fromAddress
            ? `${foundEstimateRequest.fromAddress.city} ${foundEstimateRequest.fromAddress.district}`.trim()
            : "출발지";
          const toAddress = foundEstimateRequest.toAddress
            ? `${foundEstimateRequest.toAddress.city} ${foundEstimateRequest.toAddress.district}`.trim()
            : "도착지";
          const moverName = foundEstimate.mover?.nickname || foundEstimate.mover?.name || "업체";

          estimateTitle = `${moverName} 완료된 견적 | Moving`;
          estimateDescription = `${fromAddress}에서 ${toAddress}로의 ${moveType} 이사가 완료되었습니다. ${moverName}과의 이사 경험을 리뷰로 남겨보세요.`;
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
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/received/${id}`,
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
      title: "완료된 견적 상세 | Moving",
      description: "완료된 이사 견적을 확인하고 리뷰를 작성하세요. 과거 이사 기록을 관리할 수 있습니다.",
      openGraph: {
        title: "완료된 견적 상세 | Moving",
        description: "완료된 이사 견적을 확인하고 리뷰를 작성하세요. 과거 이사 기록을 관리할 수 있습니다.",
        type: "website",
        url: `https://gomoving.site/${locale}/estimateRequest/(my)/received/${id}`,
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
  return <UserReceivedEstimateRequestDetailPage />;
}
