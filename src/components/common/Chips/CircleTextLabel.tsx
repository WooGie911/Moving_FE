"use client";
import React, { useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

type TProps = {
  text: string;
  Clickable?: boolean;
  size?: "sm" | "md" | "responsive"; // responsive 옵션 추가
  onClick?: () => void;
};

export const CircleTextLabel = ({ text, Clickable = false, onClick, size = "responsive" }: TProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  // 반응형 사이즈 결정
  const getResponsiveSize = () => {
    if (size === "responsive") {
      return isMobile ? "sm" : "md";
    }
    return size;
  };

  const currentSize = getResponsiveSize();

  return Clickable ? (
    <div>
      <div
        className={`inline-flex cursor-pointer items-center justify-start rounded-full border py-1.5 ${
          currentSize === "sm" ? "h-[36px] px-3" : "h-[46px] px-5"
        } ${isClicked ? "border-primary-400 bg-primary-100" : "border-gray-300 bg-gray-100"}`}
        onClick={handleClick}
      >
        <p
          className={`text-sm font-semibold ${
            currentSize === "sm" ? "text-[14px] leading-[20px]" : "text-[18px] leading-[26px]"
          } ${isClicked ? "text-primary-400" : "text-gray-900"}`}
        >
          {text}
        </p>
      </div>
    </div>
  ) : (
    <div>
      <div
        className={`bg-primary-100 inline-flex items-center justify-start rounded-full px-3 py-1.5 ${
          currentSize === "sm" ? "h-6 px-[6px]" : "h-8 px-[8.5px]"
        }`}
      >
        <p
          className={`text-primary-400 ${
            currentSize === "sm" ? "text-[12px] leading-[16px]" : "text-[14px] leading-[20px]"
          } font-semibold`}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
