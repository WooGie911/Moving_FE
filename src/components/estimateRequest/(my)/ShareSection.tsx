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

export const ShareSection = () => {
  // 클립보드 복사 핸들러
  const handleClipCopy = async () => {
    try {
      const currentUrl = getCurrentPageUrl();
      const success = await copyToClipboard(currentUrl);

      if (success) {
        showShareSuccess("clip");
      } else {
        showShareError("클립보드 복사에 실패했습니다.");
      }
    } catch (error) {
      console.error("클립보드 복사 오류:", error);
      showShareError("클립보드 복사에 실패했습니다.");
    }
  };

  // 카카오톡 공유 핸들러
  const handleKakaoShare = async () => {
    try {
      const currentUrl = getCurrentPageUrl();
      const title = "견적서 공유하기";
      const description = "견적서 공유하기";

      await shareToKakao(currentUrl, title, description);
      showShareSuccess("kakao");
    } catch (error) {
      console.error("ShareSection - 카카오톡 공유 오류:", error);
      showShareError("카카오톡 공유에 실패했습니다.");
    }
  };

  // 페이스북 공유 핸들러
  const handleFacebookShare = () => {
    try {
      const currentUrl = getCurrentPageUrl();
      shareToFacebook(currentUrl, "견적서 공유하기", "견적서 공유하기");
      showShareSuccess("facebook");
    } catch (error) {
      console.error("페이스북 공유 오류:", error);
      showShareError("페이스북 공유에 실패했습니다.");
    }
  };

  return (
    <>
      <div className="flex flex-col items-start justify-center gap-3 py-3 lg:gap-[22px]">
        <p className="text-black-400 text-[16px] leading-[32px] font-semibold md:text-[20px] lg:hidden">
          나만 알기엔 아쉬운 기사님 인가요?
        </p>
        <p className="text-black-400 hidden text-[16px] leading-[32px] font-semibold md:text-[20px] lg:block">
          견적서 공유하기
        </p>

        <div className="flex w-full flex-row items-center justify-start gap-3 md:gap-4">
          <button
            className="border-border-light flex h-10 w-10 cursor-pointer flex-row items-center justify-center rounded-[8px] border-1 transition-colors hover:bg-gray-50 lg:h-16 lg:w-16 lg:rounded-[16px]"
            onClick={handleClipCopy}
            aria-label="링크 복사"
          >
            <div className="relative h-6 w-6 lg:h-9 lg:w-9">
              <Image src={share} alt="share" fill />
            </div>
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer transition-transform hover:scale-105 lg:h-16 lg:w-16"
            onClick={handleKakaoShare}
            aria-label="카카오톡 공유"
          >
            <Image src={kakaohare} alt="kakaohare" fill />
          </button>
          <button
            className="relative h-10 w-10 cursor-pointer transition-transform hover:scale-105 lg:h-16 lg:w-16"
            onClick={handleFacebookShare}
            aria-label="페이스북 공유"
          >
            <Image src={facebookshare} alt="facebookshare" fill />
          </button>
        </div>
      </div>
    </>
  );
};
