import { SharePage } from "@/pageComponents/share/SharePage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "moverEstimate" });

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
    openGraph: {
      title: t("metadata.title"),
      description: t("metadata.description"),
      type: "website",
      url: `https://gomoving.site/${locale}/share`,
      siteName: "무빙",
      images: [
        {
          url: "https://gomoving.site/og-image.png",
          width: 1200,
          height: 630,
          alt: "무빙 - 이사 서비스 플랫폼",
          type: "image/png",
        },
      ],
      locale: locale,
    },
    twitter: {
      card: "summary_large_image",
      title: t("metadata.title"),
      description: t("metadata.description"),
      images: ["https://gomoving.site/og-image.png"],
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
  };
}

export default function page() {
  return <SharePage />;
}
