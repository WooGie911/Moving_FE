import { Metadata } from "next";
import SearchMoverDetailPage from "@/pageComponents/searchMover/SearchMoverDetailPage";

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050"}/movers/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const result = await response.json();
      const mover = result.data;
      const moverName = mover?.nickname || mover?.user?.name || "기사님";

      return {
        title: `${moverName} 기사님을 찾고 계신가요?`,
        description: `${moverName} 기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.`,
        openGraph: {
          title: `${moverName} 기사님을 찾고 계신가요?`,
          description: `${moverName} 기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.`,
          type: "website",
          url: `https://gomoving.site/searchMover/${id}`,
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
    }
  } catch (error) {
    console.error("메타데이터 생성 중 오류:", error);
  }

  // 기본 메타데이터 반환 (API 호출 실패 시)
  return {
    title: "기사님을 찾고 계신가요?",
    description: "기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.",
    openGraph: {
      title: "기사님을 찾고 계신가요?",
      description: "기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.",
      type: "website",
      url: `https://gomoving.site/searchMover/${id}`,
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
}

export default async function Page() {
  return <SearchMoverDetailPage />;
}
