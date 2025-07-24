import { LandingPage } from "@/pageComponents/landing/LadingPage";
import React from "react";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  // 정적 렌더링 활성화
  setRequestLocale(locale);

  return <LandingPage />;
}
