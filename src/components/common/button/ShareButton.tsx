"use client";

import React from "react";
import Image from "next/image";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IShareButtonProps } from "@/types/button";
import iconClip from "@/assets/icon/clip/icon-clip-md.svg";
import iconShareKakao from "@/assets/icon/share/icon-share-kakao-lg.svg";
import iconShareFacebook from "@/assets/icon/share/icon-share-facebook-lg.svg";
import {
  copyToClipboard,
  getCurrentPageUrl,
  shareToKakao,
  shareToFacebook,
  showShareSuccess,
  showShareError,
} from "@/utils/shareUtils";

/**
 * ShareButton 컴포넌트(ShareButtonGroup에서만 사용)
 */
export const ShareButton = ({
  type,
  url = "",
  title,
  description,
  imageUrl,
  className = "",
  onSuccess,
  onError,
}: IShareButtonProps) => {
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

  // 클립보드 복사
  const handleClipCopy = async () => {
    try {
      const shareUrl = url || getCurrentPageUrl();
      const success = await copyToClipboard(shareUrl);

      if (success) {
        showShareSuccess("clip");
        onSuccess?.();
      } else {
        const errorMessage = "클립보드 복사에 실패했습니다.";
        showShareError(errorMessage);
        onError?.(errorMessage);
      }
    } catch (error) {
      const errorMessage = "클립보드 복사에 실패했습니다.";
      showShareError(errorMessage);
      onError?.(errorMessage);
    }
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    try {
      const shareUrl = url || getCurrentPageUrl();
      shareToKakao(shareUrl, title, description, imageUrl);
      showShareSuccess("kakao");
      onSuccess?.();
    } catch (error) {
      const errorMessage = "카카오톡 공유에 실패했습니다.";
      showShareError(errorMessage);
      onError?.(errorMessage);
    }
  };

  // 페이스북 공유
  const handleFacebookShare = () => {
    try {
      const shareUrl = url || getCurrentPageUrl();

      if (!shareUrl) {
        return;
      }

      shareToFacebook(shareUrl, title, description);
      showShareSuccess("facebook");
      onSuccess?.();
    } catch (error) {
      const errorMessage = "페이스북 공유에 실패했습니다.";
      showShareError(errorMessage);
      onError?.(errorMessage);
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
