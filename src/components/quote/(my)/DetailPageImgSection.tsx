import Image from "next/image";
import React from "react";
import detailPageHeaderImg from "@/assets/img/etc/detailHeader.png";

export const DetailPageImgSection = () => {
  return (
    <div className="w-full">
      <Image
        src={detailPageHeaderImg}
        alt="detailPageHeaderImg"
        className="h-[122px] w-full object-cover md:h-[157px] lg:h-[180px]"
      />
    </div>
  );
};
