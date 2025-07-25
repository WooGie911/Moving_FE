"use client";
import Image from "next/image";
import React from "react";
import share from "@/assets/icon/clip/icon-clip.png";
import kakaohare from "@/assets/icon/share/icon-share-kakao-sm.png";
import facebookshare from "@/assets/icon/share/icon-share-facebook-sm.png";
import {
  copyToClipboard,
  getCurrentPageUrl,
  shareToKakao,
  shareToFacebook,
  showShareSuccess,
  showShareError,
} from "@/utils/shareUtils";
import { useTranslations } from "next-intl";

export const ShareSection = () => {
  const t = useTranslations("estimateRequest");

  // 클립보드 복사 핸들러
  const handleClipCopy = async () => {
    try {
      const currentUrl = getCurrentPageUrl();
      const success = await copyToClipboard(currentUrl);

      if (success) {
        showShareSuccess("clip");
      } else {
        showShareError(t("clipboardCopyFailed"));
      }
    } catch (error) {
      console.error("클립보드 복사 오류:", error);
      showShareError(t("clipboardCopyFailed"));
    }
  };

  // 카카오톡 공유 핸들러
  const handleKakaoShare = async () => {
    try {
      const currentUrl = getCurrentPageUrl();
      const title = t("shareEstimate");
      const description = t("shareEstimate");

      await shareToKakao(currentUrl, title, description);
      showShareSuccess("kakao");
    } catch (error) {
      console.error("ShareSection - 카카오톡 공유 오류:", error);
      showShareError(t("kakaoShareFailed"));
    }
  };

  // 페이스북 공유 핸들러
  const handleFacebookShare = () => {
    try {
      const currentUrl = getCurrentPageUrl();
      shareToFacebook(currentUrl, t("shareEstimate"), t("shareEstimate"));
      showShareSuccess("facebook");
    } catch (error) {
      console.error("페이스북 공유 오류:", error);
      showShareError(t("facebookShareFailed"));
    }
  };

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3 py-3 lg:gap-[22px]">
        <p className="text-black-400 text-[16px] leading-[32px] font-semibold md:text-[20px] lg:hidden">
          {t("shareDriverMessage")}
        </p>
        <p className="text-black-400 hidden text-[16px] leading-[32px] font-semibold md:text-[20px] lg:block">
          {t("shareEstimate")}
        </p>

        <div className="flex w-full flex-row items-center justify-start gap-3 md:gap-4">
          <button
            className="border-border-light flex h-10 w-10 cursor-pointer flex-row items-center justify-center rounded-[8px] border-1 transition-colors hover:bg-gray-50 lg:h-16 lg:w-16 lg:rounded-[16px]"
            onClick={handleClipCopy}
            aria-label={t("copyLinkLabel")}
          >
            <div className="relative h-6 w-6 lg:h-9 lg:w-9">
              <Image src={share} alt="share" fill />
            </div>
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer transition-transform hover:scale-105 lg:h-16 lg:w-16"
            onClick={handleKakaoShare}
            aria-label={t("shareKakaoLabel")}
          >
            <Image src={kakaohare} alt="kakaohare" fill />
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer transition-transform hover:scale-105 lg:h-16 lg:w-16"
            onClick={handleFacebookShare}
            aria-label={t("shareFacebookLabel")}
          >
            <Image src={facebookshare} alt="facebookshare" fill />
          </button>
        </div>
      </div>
    </>
  );
};
