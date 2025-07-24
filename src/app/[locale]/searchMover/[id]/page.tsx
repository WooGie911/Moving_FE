import { Metadata } from "next";
import SearchMoverDetailPage from "@/pageComponents/searchMover/SearchMoverDetailPage";

// 동적 메타데이터 생성
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  // 실제로는 API에서 기사님 정보를 가져와야 함
  const moverName = "기사님"; // 실제로는 API에서 가져온 이름

  return {
    title: `${moverName} 기사님을 찾고 계신가요?`,
    description: `${moverName} 기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.`,
    openGraph: {
      title: `${moverName} 기사님을 찾고 계신가요?`,
      description: `${moverName} 기사님의 이사 서비스를 확인해보세요. 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.`,
      type: "website",
      url: `https://gomoving.site/searchMover/${params.id}`,
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

export default function Page({ params }: { params: { id: string } }) {
  return <SearchMoverDetailPage />;
}
