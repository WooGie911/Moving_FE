"use client";
import Image from "next/image";
import React from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import box from "../../../assets/icon/icon-box.png";
import home from "../../../assets/icon/icon-home.png";
import office from "../../../assets/icon/icon-office.png";
import document from "../../../assets/icon/icon-document.png";

export const MoveTypeLabel = ({
  type,
  size = "responsive",
}: {
  type: "small" | "home" | "office" | "document";
  size?: "sm" | "md" | "responsive";
}) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const currentSize = size === "responsive" ? (isMobile ? "sm" : "md") : size;
  const sizeClass = currentSize === "sm" ? "h-[26px] py-[2px]" : "h-[32px] py-[4px]";
  return (
    <div>
      <div
        className={`bg-primary-100 inline-flex items-center justify-start gap-[2px] rounded-sm pr-[7px] pl-[4px] ${sizeClass}`}
      >
        <div className="relative h-[20px] w-[20px]">
          <Image
            src={type === "small" ? box : type === "home" ? home : type === "office" ? office : document}
            alt="movetype"
            fill
          />
        </div>
        <p
          className={`text-primary-400 inline-block text-center text-sm font-semibold ${currentSize === "sm" ? "text-[13px] leading-[22px]" : "text-[14px] leading-[24px]"}`}
        >
          {type === "small"
            ? "소형이사"
            : type === "home"
              ? "가정이사"
              : type === "office"
                ? "사무실이사"
                : "지정 견적 요청"}
        </p>
      </div>
    </div>
  );
};
