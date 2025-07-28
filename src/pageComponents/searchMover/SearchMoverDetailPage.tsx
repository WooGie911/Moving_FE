"use client";

import DetailInformation from "@/components/searchMover/[id]/DetailInformation";
import TopBar from "@/components/searchMover/[id]/TopBar";
import React from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMoverDetail } from "@/hooks/useMoverData";

const SearchMoverDetailPage = () => {
  const { id } = useParams() as { id: string };
  const t = useTranslations("mover");

  const { data: mover, isLoading, isError, error } = useMoverDetail(id);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">{t("loadingMessage")}</div>
        </div>
      </div>
    );
  }

  if (isError || !mover) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className="mb-4 text-lg text-red-500">{t("errorTitle")}</div>
        <div className="text-sm text-gray-500">{error?.message || t("notFoundMessage")}</div>
      </div>
    );
  }

  return (
    <>
      <TopBar profileImage={mover.profileImage} />
      <DetailInformation mover={mover} />
    </>
  );
};

export default SearchMoverDetailPage;
