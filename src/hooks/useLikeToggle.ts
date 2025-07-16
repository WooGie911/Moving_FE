"use client";

import { useState } from "react";
import { IUseLikeToggleProps } from "@/types/button";

export const useLikeToggle = ({ moverId, initialIsLiked = false }: IUseLikeToggleProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);

  const toggleLike = () => {
    setIsLiked(!isLiked);
    console.log(`${moverId} 찜 ${isLiked ? "해제" : "등록"}`);
  };

  return {
    isLiked,
    toggleLike,
  };
};
