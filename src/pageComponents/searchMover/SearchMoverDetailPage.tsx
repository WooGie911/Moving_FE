"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { IMoverInfo } from "@/types/mover.types";
import findMoverApi from "@/lib/api/findMover.api";
import TopBar from "@/components/searchMover/[id]/TopBar";
import DetailInformation from "@/components/searchMover/[id]/DetailInformation";

const SearchMoverDetailPage = () => {
  const { id } = useParams() as { id: string };
  const [mover, setMover] = useState<IMoverInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations("mover");

  const fetchMoverDetail = async () => {
    if (!id) return;

    setLoading(true);
    setError(null);

    try {
      const moverData = await findMoverApi.fetchMoverDetail(id);
      setMover(moverData);
    } catch (err) {
      console.error("기사님 상세 정보 조회 실패:", err);
      setError(t("errorMessage"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMoverDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="border-primary-400 h-8 w-8 animate-spin rounded-full border-4 border-t-transparent"></div>
          <div className="text-lg text-gray-500">{t("loadingMessage")}</div>
        </div>
      </div>
    );
  }

  if (error || !mover) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="mb-4 text-lg text-red-500">{t("errorTitle")}</div>
        <div className="text-sm text-gray-500">{error || t("notFoundMessage")}</div>
      </div>
    );
  }

  return (
    <>
      <TopBar profileImage={mover.profileImage} />
      <DetailInformation mover={mover} onMoverUpdate={fetchMoverDetail} />
    </>
  );
};

export default SearchMoverDetailPage;
