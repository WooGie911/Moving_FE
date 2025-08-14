"use client";

import React from "react";
import Image from "next/image";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { TopBarProps } from "@/types/mover.types";
import defaultHeader from "@/assets/img/etc/detail-header.webp";
import defaultProfileLg from "@/assets/img/mascot/moverprofile-lg.webp";
import defaultProfileMd from "@/assets/img/mascot/moverprofile-md.webp";
import defaultProfileSm from "@/assets/img/mascot/moverprofile-sm.webp";

const TopBar = ({ profileImage }: TopBarProps) => {
  const deviceType = useWindowWidth();

  let defaultProfile;
  if (deviceType === "desktop") {
    defaultProfile = defaultProfileLg;
  } else if (deviceType === "tablet") {
    defaultProfile = defaultProfileMd;
  } else {
    defaultProfile = defaultProfileSm;
  }

  return (
    <div className="relative w-full" role="banner">
      <Image
        src={defaultHeader}
        alt="기사님 프로필 배경 이미지"
        className="h-[122px] w-full md:h-[157px] lg:h-[225px]"
        role="img"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-2 left-[4vw] md:bottom-10 md:left-[8vw] lg:bottom-8 lg:left-[15vw] xl:left-[18vw]"
        style={{ transform: "translateY(50%)" }}
        role="img"
        aria-labelledby="profile-image-description"
      >
        <Image
          src={profileImage || defaultProfile}
          alt="기사님 프로필 사진"
          width={deviceType === "desktop" ? 134 : 50}
          height={deviceType === "desktop" ? 134 : 50}
          className="h-[50px] min-h-[50px] w-[50px] min-w-[50px] flex-shrink-0 rounded-[12px] object-cover md:h-[134px] md:min-h-[134px] md:w-[134px] md:min-w-[134px]"
          role="img"
          aria-describedby="profile-image-description"
        />
        <span id="profile-image-description" className="sr-only">
          {profileImage ? "기사님의 프로필 사진" : "기본 프로필 이미지"}
        </span>
      </div>
    </div>
  );
};

export default TopBar;
