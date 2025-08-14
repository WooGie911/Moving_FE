"use client";

import Image from "next/image";
import React, { useRef } from "react";
import userApi from "@/lib/api/user.api";
import { useTranslations } from "next-intl";
import { showWarningToast } from "@/utils/toastUtils";
import { renameFileWithTimestamp } from "@/utils/fileName";

interface IProfileImageUploadProps {
  uploadSkeleton: string;
  onImageChange: (imageData: { name: string; type: string; dataUrl: string }) => void;
  selectedImage: { name: string; type: string; dataUrl: string };
  className?: string;
}

export const ProfileImageUpload = ({
  uploadSkeleton,
  onImageChange,
  selectedImage,
  className = "",
}: IProfileImageUploadProps) => {
  const t = useTranslations("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // ✅ 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      showWarningToast(t("imageUploadError"));
      return;
    }

    // ✅ 파일명 변경
    const renamedFile = renameFileWithTimestamp(file);
    console.log("renamedFile", renamedFile);

    // ✅ 업로드
    const fileUrl = await userApi.uploadFilesToS3(renamedFile);

    // ✅ 상태 업데이트
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange({
        name: renamedFile.name,
        type: renamedFile.type,
        dataUrl: fileUrl,
      });
    };

    reader.readAsDataURL(renamedFile);
  };

  const isUploaded = Boolean(selectedImage.name);
  const imageSrc = isUploaded ? selectedImage.dataUrl : uploadSkeleton;
  const imageAlt = isUploaded ? t("aria.profileImgButtonAlt") : t("aria.defaultProfileImgAlt");

  return (
    <section
      className={`border-border-light flex flex-col gap-4 border-b-1 pb-4 ${className}`}
      aria-label={t("aria.profileImgLabel")}
    >
      <h2 className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl">{t("profileImg")}</h2>

      <button
        type="button"
        className="flex h-[160px] w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100"
        onClick={handleImageClick}
        aria-label={t("profileImg")}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          width={160}
          height={160}
          sizes="160px"
          priority={!isUploaded} // 초기 스켈레톤만 LCP 후보로
          className="h-full w-full object-cover"
        />
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
    </section>
  );
};
