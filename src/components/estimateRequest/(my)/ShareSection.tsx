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
import { useTranslations, useLocale } from "next-intl";
import { getRegionLabel } from "@/lib/utils/regionMapping";

interface ShareSectionProps {
  estimate?: {
    price: number;
    mover?: {
      nickname: string;
      profileImage?: string;
    };
  };
  estimateRequest?: {
    moveType: string;
    fromAddress: {
      region: string;
      city: string;
      district: string;
    };
    toAddress: {
      region: string;
      city: string;
      district: string;
    };
  };
}

export const ShareSection = ({ estimate, estimateRequest }: ShareSectionProps) => {
  const t = useTranslations("estimateRequest");
  const tShared = useTranslations();
  const locale = useLocale();

  // 견적 정보를 포함한 공유 메시지 생성
  const generateShareMessage = () => {
    if (!estimate) {
      return {
        title: t("shareEstimate"),
        description: t("shareEstimate"),
        imageUrl: "https://gomoving.site/logo-m.png",
      };
    }

    const shareTitle = `${estimate.mover?.nickname} 기사님의 견적서 - Moving`;

    // 이사 정보 생성
    let moveInfo = "";
    if (estimateRequest) {
      const fromRegion = getRegionLabel(estimateRequest.fromAddress.region);
      const toRegion = getRegionLabel(estimateRequest.toAddress.region);
      const fromCity = estimateRequest.fromAddress.city;
      const toCity = estimateRequest.toAddress.city;
      const fromDistrict = estimateRequest.fromAddress.district;
      const toDistrict = estimateRequest.toAddress.district;
      const moveType =
        estimateRequest.moveType === "SMALL"
          ? "소형이사"
          : estimateRequest.moveType === "HOME"
            ? "가정이사"
            : "사무실이사";

      moveInfo = `${fromRegion} ${fromCity}${fromDistrict}에서 ${toRegion} ${toCity}${toDistrict} ${moveType}`;
    }

    const shareDescription = `${estimate.mover?.nickname}  기사님의 견적서입니다! ${moveInfo} 견적가 ${estimate.price.toLocaleString()}원으로 안전하고 신뢰할 수 있는 이사 서비스를 제공합니다.`;
    const shareImageUrl = estimate.mover?.profileImage || "https://gomoving.site/logo-m.png";

    return { title: shareTitle, description: shareDescription, imageUrl: shareImageUrl };
  };

  const shareInfo = generateShareMessage();

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
      await shareToKakao(currentUrl, shareInfo.title, shareInfo.description, shareInfo.imageUrl);
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
      shareToFacebook(currentUrl, shareInfo.title, shareInfo.description);
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
