"use client";

import React from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import type { IButtonProps } from "@/types/button";
import iconEdit from "@/assets/icon/edit/icon-edit-white-lg.svg";
import iconLikeBlack from "@/assets/icon/like/icon-like-btn-black.svg";
import iconUnLike from "@/assets/icon/like/icon-like-white-lg.svg";

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
 * @param width - 버튼 너비
 * @param height - 버튼 높이
 * @param rounded - 버튼 라운드 여부
 * @param style - 버튼 스타일
 * @param ariaLabel - ARIA 라벨
 * @param ariaDescribedby - ARIA 설명 ID
 */
export const Button = ({
  type = "button",
  variant,
  state = "default",
  children,
  onClick,
  isEditButton = false,
  className = "",
  disabled = false,
  isLiked = false,
  width = "",
  height = "",
  rounded = "",
  style,
  fontSize = "",
  ariaLabel,
  ariaDescribedby,
}: IButtonProps) => {
  const t = useTranslations("mover");
  /* Solid */
  const solidBase =
    "flex items-center justify-center text-gray-50 font-semibold transition-colors duration-200 focus:outline-none cursor-pointer";
  let solidState = "bg-primary-400 hover:bg-primary-500";
  if (state === "disabled" || disabled) solidState = "bg-gray-300 cursor-not-allowed";

  /* Outlined */
  const outlinedBase =
    "flex items-center justify-center border-[1px] text-primary-400 font-semibold transition-colors duration-200 focus:outline-none cursor-pointer";
  let outlinedState = "border-primary-400 text-primary-400 bg-inherit hover:bg-primary-50";
  if (state === "active") outlinedState = "border-primary-400 text-primary-400 bg-primary-100";
  if (state === "done") outlinedState = "border-gray-150 text-gray-600! bg-inherit";

  /* Like(찜) 버튼 */
  if (variant === "like") {
    const likeIcon = isLiked ? iconLikeBlack : iconUnLike;
    const likeIconSize = 24;
    return (
      <button
        type={type}
        className={`text-2lg flex cursor-pointer items-center justify-center border-[1px] border-gray-200 transition-all duration-200 hover:scale-105 focus:outline-none ${width} ${height} ${rounded} ${className}`}
        onClick={onClick}
        style={style}
        aria-label={ariaLabel || (isLiked ? "찜 해제" : "찜하기")}
        aria-describedby={ariaDescribedby}
        aria-pressed={isLiked}
      >
        <Image
          src={likeIcon}
          alt={isLiked ? "찜 해제 아이콘" : "찜하기 아이콘"}
          width={likeIconSize}
          height={likeIconSize}
        />
        <span className="ml-[10px] hidden font-semibold text-black lg:inline">{t("favoriteDriver")}</span>
      </button>
    );
  }

  /* 버튼 클래스 조합 */
  const buttonClass =
    variant === "solid"
      ? `${solidBase} ${solidState} ${width} ${height} ${rounded} ${fontSize} ${className}`
      : `${outlinedBase} ${outlinedState} ${width} ${height} ${rounded} ${fontSize} ${className}`;

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={variant === "solid" ? state === "disabled" || disabled : false}
      style={style}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
      aria-disabled={variant === "solid" ? state === "disabled" || disabled : false}
    >
      {children}
      {/* 수정 아이콘 */}
      {variant === "solid" && isEditButton && (
        <Image src={iconEdit} alt="수정 아이콘" width={24} height={24} className="ml-2" aria-hidden="true" />
      )}
    </button>
  );
};
