"use client";

import React from "react";
import Image from "next/image";
import userAvatarLg from "@/assets/img/mascot/user-avatartion-lg.png";
import moverAvatarLg from "@/assets/img/mascot/mover-avatartion-lg.png";
import { UserType } from "@/types/user";

const MascotCharacter = ({ userType }: { userType: UserType }) => {
  const avatarSrc = userType === "CUSTOMER" ? userAvatarLg : moverAvatarLg;
  const altText = userType === "CUSTOMER" ? "userAvatar" : "moverAvatar";

  return (
    <div className="pointer-events-none absolute hidden select-none md:-right-[90px] md:bottom-[-50px] md:block md:w-[200px] lg:-right-[300px] lg:bottom-[-30px] lg:w-[350px]">
      <Image src={avatarSrc} alt={altText} layout="responsive" placeholder="blur" />
    </div>
  );
};

export default MascotCharacter;
