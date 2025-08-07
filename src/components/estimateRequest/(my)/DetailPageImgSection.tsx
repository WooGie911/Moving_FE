import Image from "next/image";
import React from "react";
import detailPageHeaderImg from "@/assets/img/etc/detail-header.webp";

export const DetailPageImgSection = () => {
  return (
    <div className="relative h-[122px] w-full">
      <Image src={detailPageHeaderImg} alt="detailPageHeaderImg" className="object-cover md:h-[157px] lg:h-[180px]" />
    </div>
  );
};
