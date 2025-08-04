import MoverSigninPage from "@/pageComponents/auth/moverSignin/MoverSigninPage";
import React from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.moverSigninMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function page() {
  return <MoverSigninPage />;
}
