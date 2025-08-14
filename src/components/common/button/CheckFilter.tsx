import React from "react";
import Image from "next/image";
import iconCheckboxSquareActive from "@/assets/icon/checkbox/icon-checkbox-square-active.png";
import iconCheckboxSquareInactive from "@/assets/icon/checkbox/icon-checkbox-square-inactive.png";
import iconFilterActive from "@/assets/icon/filter/icon-filter-active.png";
import iconFilterInactive from "@/assets/icon/filter/icon-filter-inactive.png";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { ICheckFilterProps } from "@/types/button";

/**
 * 데스크탑: 네모 체크박스 + 텍스트
 * 모바일/태블릿: 필터 이미지 버튼
 */
export const CheckFilter = ({ checked, onChange, label, className = "" }: ICheckFilterProps) => {
  const deviceType = useWindowWidth();
  const isDesktop = deviceType === "desktop";

  if (isDesktop) {
    return (
      <button
        type="button"
        className={`flex cursor-pointer items-center transition-all duration-200 hover:scale-105 focus:outline-none ${className}`}
        onClick={() => onChange(!checked)}
        aria-checked={checked}
        role="checkbox"
      >
        <Image
          src={checked ? iconCheckboxSquareActive : iconCheckboxSquareInactive}
          alt={checked ? "선택됨" : "선택되지 않음"}
          width={36}
          height={36}
        />
        <span className="text-4 font-normal">{label}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`flex h-8 w-8 cursor-pointer items-center justify-center bg-white p-0 transition-all duration-200 hover:scale-105 focus:outline-none ${className}`}
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
    >
      <Image
        src={checked ? iconFilterActive : iconFilterInactive}
        alt={checked ? "필터 활성화" : "필터 비활성화"}
        width={32}
        height={32}
      />
    </button>
  );
};
