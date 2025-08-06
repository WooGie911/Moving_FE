"use client";

import DetailInformation from "@/components/searchMover/[id]/DetailInformation";
import TopBar from "@/components/searchMover/[id]/TopBar";
import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { useMoverDetail } from "@/hooks/useMoverData";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

const SearchMoverDetailPage = () => {
  const { id } = useParams() as { id: string };
  const t = useTranslations("mover");

  const { data: mover, isLoading, isError, error } = useMoverDetail(id);

  // 페이지 마운트 시 스크롤을 맨 위로 올림
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-200">
        <MovingTruckLoader size="lg" loadingText="기사님 정보를 불러오는 중..." />
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
