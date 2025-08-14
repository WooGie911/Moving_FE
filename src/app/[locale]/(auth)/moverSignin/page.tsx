import MoverSigninPage from "@/pageComponents/auth/moverSignin/MoverSigninPage";
import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// ISR: 5분마다 재생성
export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("moverSigninMetadata.title"),
    description: t("moverSigninMetadata.description"),
  };
}

export default function page() {
  return <MoverSigninPage />;
}
