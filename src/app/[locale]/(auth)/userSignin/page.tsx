import UserSigninPage from "@/pageComponents/auth/userSignin/UserSigninPage";
import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// ISR: 5분마다 재생성
export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("userSigninMetadata.title"),
    description: t("userSigninMetadata.description"),
  };
}

export default function page() {
  return <UserSigninPage />;
}
