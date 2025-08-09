"use client";

import DetailInformation from "@/components/searchMover/[id]/DetailInformation";
import TopBar from "@/components/searchMover/[id]/TopBar";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMoverDetail } from "@/hooks/useMoverData";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import * as Sentry from "@sentry/nextjs";

const SearchMoverDetailPage = () => {
  const { id } = useParams() as { id: string };
  const t = useTranslations("mover");

  const { data: mover, isLoading, isError, error } = useMoverDetail(id);

  React.useEffect(() => {
    Sentry.setContext("SearchMoverDetailPage", {
      moverId: id,
    });
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isError && error) {
      Sentry.captureException(error, {
        tags: {
          component: "SearchMoverDetailPage",
          action: "useMoverDetail",
        },
        extra: {
          moverId: id,
        },
      });
    }
  }, [isError, error, id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <MovingTruckLoader size="lg" loadingText={t("loadingMoverInfo")} />
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
