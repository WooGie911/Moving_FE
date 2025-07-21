"use client";

import React from "react";
import { ShareButton } from "./ShareButton";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { IShareButtonGroupProps } from "@/types/button";

/**
 * ShareButtonGroup 컴포넌트
 * @param url - 공유할 URL (현재 페이지 URL)
 * @param className - 추가 CSS 클래스
 * @param onSuccess - 공유 성공 시 호출될 콜백 함수
 * @param onError - 공유 실패 시 호출될 콜백 함수
 * TODO: 추후 카카오톡, 페이스북 API 연동 시 추가 예정
 * @param title - 공유 타이틀 (추후 API 연동 시 사용)
 * @param description - 공유 설명 (추후 API 연동 시 사용)
 */
export const ShareButtonGroup = ({
  url = "",
  title,
  description,
  className = "",
  onSuccess,
  onError,
}: IShareButtonGroupProps) => {
  const deviceType = useWindowWidth();
  const isDesktop = deviceType === "desktop";
  const gapClass = isDesktop ? "gap-4" : "gap-3";

  return (
    <div className={`flex items-center ${gapClass} ${className}`}>
      <ShareButton
        type="clip"
        url={url}
        title={title}
        description={description}
        onSuccess={onSuccess}
        onError={onError}
      />
      <ShareButton
        type="kakao"
        url={url}
        title={title}
        description={description}
        onSuccess={onSuccess}
        onError={onError}
      />
      <ShareButton
        type="facebook"
        url={url}
        title={title}
        description={description}
        onSuccess={onSuccess}
        onError={onError}
      />
    </div>
  );
};
