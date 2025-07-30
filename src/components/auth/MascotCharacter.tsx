"use client";

import React from "react";
import Image from "next/image";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import userAvatarLg from "@/assets/img/mascot/user-avatartion-lg.png";
import moverAvatarLg from "@/assets/img/mascot/mover-avatartion-lg.png";

interface MascotCharacterProps {
  userType: "CUSTOMER" | "MOVER";
}

const MascotCharacter = ({ userType }: MascotCharacterProps) => {
  const deviceType = useWindowWidth();
  const avatarSrc = userType === "CUSTOMER" ? userAvatarLg : moverAvatarLg;
  const altText = userType === "CUSTOMER" ? "userAvatar" : "moverAvatar";

  if (deviceType === "tablet") {
    return (
      <div className="relative flex min-w-[180px]">
        <Image src={avatarSrc} alt={altText} width={180} className="absolute -right-[330px] -bottom-[54px]" />
      </div>
    );
  }

  if (deviceType === "desktop") {
    return (
      <div className="relative flex min-w-[420px]">
        <Image src={avatarSrc} alt={altText} width={420} className="absolute -right-[520px] -bottom-[80px]" />
      </div>
    );
  }

  return null;
};

export default MascotCharacter;
