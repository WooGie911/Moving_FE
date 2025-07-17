"use client";

import DetailInformation from "@/components/searchMover/[id]/DetailInformation";
import TopBar from "@/components/searchMover/[id]/TopBar";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverInfo } from "@/types/findMover";

const SearchMoverDetailPage = () => {
  const { id } = useParams() as { id: string };
  const [mover, setMover] = useState<IMoverInfo | null>(null);

  useEffect(() => {
    if (id) {
      findMoverApi.fetchMoverDetail(Number(id)).then(setMover);
    }
  }, [id]);

  if (!mover) return <div>로딩중...</div>;

  return (
    <>
      <TopBar profileImage={mover.profileImage} />
      <DetailInformation mover={mover} />
    </>
  );
};

export default SearchMoverDetailPage;
