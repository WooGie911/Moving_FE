"use client";

import React from "react";
import Image from "next/image";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IButtonProps } from "@/types/button";
import iconEdit from "@/assets/icon/edit/icon-edit.png";
import iconLikeBlack from "@/assets/icon/like/icon-like-black.png";
import iconUnLike from "@/assets/icon/like/icon-like-white-lg.png";

/**
 * Button 컴포넌트
 *
 * @param variant - 버튼 타입 (solid, outlined, like)
 * @param state - 버튼 상태 (default, disabled, active, done)
 * @param children - 버튼 내용
 * @param onClick - 버튼 클릭 시 실행할 함수
 * @param isEditButton - 수정 버튼 여부 (solid 버튼에서만 사용)
 * @param className - 버튼 추가 클래스
 * @param disabled - 버튼 비활성화 여부 (solid, outlined 버튼에서만 사용)
 * @param isLiked - 찜(좋아요) 상태 (like 버튼에서만 사용)
 */
export const Button = ({
  variant,
  state = "default",
  children,
  onClick,
  isEditButton = false,
  className = "",
  disabled = false,
  isLiked = false,
}: IButtonProps) => {
  const deviceType = useWindowWidth();
  const isMobile = deviceType === "mobile";
  const isTablet = deviceType === "tablet";

  /* Solid */
  const solidBase =
    "flex items-center justify-center text-gray-50 font-semibold transition-colors duration-200 focus:outline-none ";
  const solidSize = isMobile
    ? "h-[54px] w-[327px] text-md rounded-[12px]"
    : "h-[60px] w-[640px] text-lg rounded-[16px]";
  let solidState = "bg-primary-400 hover:bg-primary-500";
  if (state === "disabled" || disabled) solidState = "bg-gray-300 cursor-not-allowed";

  /* Outlined */
  const outlinedBase =
    "flex items-center justify-center border-[1px] text-primary-400 font-semibold transition-colors duration-200 focus:outline-none ";
  const outlinedSize = isMobile
    ? "h-[54px] w-[327px] text-md rounded-[12px]"
    : "h-[60px] w-[640px] text-lg rounded-[16px]";
  let outlinedState = "border-primary-400 text-primary-400 bg-inherit hover:bg-primary-50";
  if (state === "active") outlinedState = "border-primary-400 text-primary-400 bg-primary-100";
  if (state === "done") outlinedState = "border-gray-150 text-gray-600! bg-inherit";

  /* Like(찜) 버튼 */
  if (variant === "like") {
    const likeSize = isMobile || isTablet ? "h-[54px] w-[54px]" : "h-[54px] w-[320px] text-md flex-row";
    const likeIcon = isLiked ? iconLikeBlack : iconUnLike;
    const likeIconSize = 24;
    const likeText =
      isMobile || isTablet ? null : <span className="ml-[10px] font-semibold text-black">기사님 찜하기</span>;
    return (
      <button
        type="button"
        className={`flex items-center justify-center rounded-[16px] border-[1px] border-gray-200 transition-all duration-200 focus:outline-none ${likeSize} ${className}`}
        onClick={onClick}
      >
        <Image src={likeIcon} alt="찜" width={likeIconSize} height={likeIconSize} />
        {likeText}
      </button>
    );
  }

  /* 버튼 클래스 조합 */
  const buttonClass =
    variant === "solid"
      ? `${solidBase} ${solidSize} ${solidState} ${className}`
      : `${outlinedBase} ${outlinedSize} ${outlinedState} ${className}`;

  return (
    <button
      type="button"
      className={buttonClass}
      onClick={onClick}
      disabled={variant === "solid" ? state === "disabled" || disabled : false}
    >
      {children}
      {/* 수정 아이콘 */}
      {variant === "solid" && isEditButton && (
        <Image src={iconEdit} alt="수정" width={24} height={24} className="ml-2" />
      )}
    </button>
  );
};
