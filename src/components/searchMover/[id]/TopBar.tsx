"use client";

import Image from "next/image";
import React from "react";
import defaultHeader from "@/assets/img/etc/detailHeader.png";
import defaultProfileLg from "@/assets/img/mascot/moverprofile-lg.png";
import defaultProfileMd from "@/assets/img/mascot/moverprofile-md.png";
import defaultProfileSm from "@/assets/img/mascot/moverprofile-sm.png";
import { useWindowWidth } from "@/hooks/useWindowWidth";

const TopBar = () => {
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
    <div className="relative w-full">
      <Image src={defaultHeader} alt="default-header" className="h-[122px] w-full md:h-[157px] lg:h-[225px]" />
      <div
        className="absolute bottom-4 left-[4vw] md:left-[8vw] lg:left-[15vw] xl:left-[18vw]"
        style={{ transform: "translateY(50%)" }}
      >
        <Image src={defaultProfile} alt="default-profile" />
      </div>
    </div>
  );
};

export default TopBar;
