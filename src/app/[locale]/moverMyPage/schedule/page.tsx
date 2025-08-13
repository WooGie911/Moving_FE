import React from "react";
import MoverSchedulePage from "@/pageComponents/moverMyPage/schedule/MoverSchedulePage";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  // 현재 로케일 기준으로 메타데이터 생성
  const t = await getTranslations({ locale: params.locale, namespace: "schedule.metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

const MoverMyPageSchedulePage = () => {
  return <MoverSchedulePage />;
};

export default MoverMyPageSchedulePage;
