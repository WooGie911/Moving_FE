"use client";

import React from "react";
import Image from "next/image";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IShareButtonProps } from "@/types/button";
import iconClip from "@/assets/icon/icon-clip-md.png";
import iconShareKakao from "@/assets/icon/icon-share-kakao-lg.png";
import iconShareFacebook from "@/assets/icon/icon-share-facebook-lg.png";

/**
 * ShareButton 컴포넌트(ShareButtonGroup에서만 사용)
 */
export const ShareButton = ({ type, url = "", className = "", onSuccess, onError }: IShareButtonProps) => {
  const deviceType = useWindowWidth();
  const isDesktop = deviceType === "desktop";

  // 공유 이미지
  const getIcon = () => {
    switch (type) {
      case "clip":
        return iconClip;
      case "kakao":
        return iconShareKakao;
      case "facebook":
        return iconShareFacebook;
    }
  };

  // 현재 페이지 URL 생성
  const getCurrentPageUrl = () => {
    if (url) return url;
    if (typeof window !== "undefined") {
      return window.location.href;
    }
    return "";
  };

  // 클립보드 복사
  const handleClipCopy = async () => {
    try {
      const shareUrl = getCurrentPageUrl();
      await navigator.clipboard.writeText(shareUrl);
      onSuccess?.();
    } catch {
      onError?.("클립보드 복사에 실패했습니다.");
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    try {
      const shareUrl = getCurrentPageUrl();
      // TODO: 카카오톡 API 연결 필요
      console.log("카카오톡 공유 URL:", shareUrl);
      onSuccess?.();
    } catch {
      onError?.("카카오톡 공유 기능이 아직 구현되지 않았습니다.");
    }
  };

  // 페이스북 공유
  const handleFacebookShare = () => {
    try {
      const shareUrl = getCurrentPageUrl();
      // TODO: 페이스북 API 연결 필요
      console.log("페이스북 공유 URL:", shareUrl);
      onSuccess?.();
    } catch {
      onError?.("페이스북 공유 기능이 아직 구현되지 않았습니다.");
    }
  };

  const handleClick = () => {
    switch (type) {
      case "clip":
        handleClipCopy();
        break;
      case "kakao":
        handleKakaoShare();
        break;
      case "facebook":
        handleFacebookShare();
        break;
    }
  };

  const icon = getIcon();

  const sizeClass = isDesktop ? "w-16 h-16" : "w-10 h-10";

  const clipRoundedClass = type === "clip" ? (isDesktop ? "rounded-2xl!" : "rounded-lg") : "";

  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-lg transition-all duration-200 hover:scale-105 focus:outline-none ${sizeClass} ${className} ${
        type === "clip" ? `border border-gray-200 bg-white ${clipRoundedClass}` : ""
      }`}
      onClick={handleClick}
      aria-label={`${type === "kakao" ? "카카오톡" : type} 공유하기`}
    >
      <Image
        src={icon}
        alt={`${type === "kakao" ? "카카오톡" : type} 공유`}
        width={type === "clip" ? (isDesktop ? 36 : 24) : isDesktop ? 64 : 40}
        height={type === "clip" ? (isDesktop ? 36 : 24) : isDesktop ? 64 : 40}
      />
    </button>
  );
};
