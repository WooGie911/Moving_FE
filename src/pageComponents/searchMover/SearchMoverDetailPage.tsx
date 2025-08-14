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
      <main className="min-h-screen bg-gray-200" role="main" aria-live="polite" aria-label="기사님 상세 정보 로딩중">
        <MovingTruckLoader size="lg" loadingText={t("loadingMoverInfo")} />
      </main>
    );
  }

  if (isError || !mover) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center" role="main">
        <section role="alert" aria-live="assertive">
          <h1 className="mb-4 text-lg text-red-500" role="heading" aria-level={1}>
            {t("errorTitle")}
          </h1>
          <p className="text-sm text-gray-500">{error?.message || t("notFoundMessage")}</p>
        </section>
      </main>
    );
  }

  return (
    <main role="main">
      {/* 스킵 링크 - 웹 접근성을 위한 키보드 네비게이션 */}
      <nav className="sr-only focus-within:not-sr-only" aria-label="빠른 이동 메뉴">
        <a
          href="#mover-profile"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          기사님 프로필로 바로가기
        </a>
        <a
          href="#mover-details"
          className="bg-primary-500 hover:bg-primary-400 absolute top-0 left-0 z-50 ml-2 p-2 text-sm font-medium text-white transition-colors focus:relative focus:z-auto focus:block"
          tabIndex={0}
        >
          상세 정보로 바로가기
        </a>
      </nav>

      {/* 기사님 프로필 헤더 */}
      <header id="mover-profile" aria-labelledby="mover-name">
        <TopBar profileImage={mover.profileImage} />
      </header>

      {/* 기사님 상세 정보 */}
      <section id="mover-details" aria-labelledby="mover-detail-title">
        <h1 id="mover-detail-title" className="sr-only">
          {mover.nickname || mover.name} 기사님 상세 정보
        </h1>
        <DetailInformation mover={mover} />
      </section>
    </main>
  );
};

export default SearchMoverDetailPage;
