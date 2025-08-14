"use client";

import React from "react";
import Image from "next/image";
import { TUserType } from "@/types/user";

const MascotCharacter = ({ userType }: { userType: TUserType }) => {
  // Vercel CDN 활용을 위해 public 경로 사용
  const avatarSrc = userType === "CUSTOMER" ? "/img/mascot/user-avatartion.webp" : "/img/mascot/mover-avatartion.webp";
  const altText = userType === "CUSTOMER" ? "userAvatar" : "moverAvatar";

  return (
    <div className="pointer-events-none absolute hidden select-none md:-right-[90px] md:bottom-[-50px] md:block md:w-[200px] lg:-right-[300px] lg:bottom-[-30px] lg:w-[350px]">
      <Image src={avatarSrc} alt={altText} width={350} height={350} priority />
    </div>
  );
};

export default MascotCharacter;
