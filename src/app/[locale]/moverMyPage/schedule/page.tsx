import React from "react";
import MoverSchedulePage from "@/pageComponents/moverMyPage/schedule/MoverSchedulePage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations("schedule.metadata");

  return {
    title: t("title"),
    description: t("description"),
  };
}

const MoverMyPageSchedulePage = () => {
  return <MoverSchedulePage />;
};

export default MoverMyPageSchedulePage;
