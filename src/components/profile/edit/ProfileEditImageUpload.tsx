"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import userApi from "@/lib/api/user.api";
import { showWarningToast } from "@/utils/toastUtils";

interface IProfileEditImageUploadProps {
  selectedImage: { name: string; type: string; dataUrl: string };
  onImageChange: (imageData: { name: string; type: string; dataUrl: string }) => void;
  uploadSkeleton: string;
  className?: string;
}

export const ProfileEditImageUpload = ({
  selectedImage,
  onImageChange,
  uploadSkeleton,
  className = "",
}: IProfileEditImageUploadProps) => {
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

    const fileUrl = await userApi.uploadFilesToS3(file);
    onImageChange({
      name: file.name,
      type: file.type,
      dataUrl: fileUrl,
    });
  };

  return (
    <section className={`border-border-light flex flex-col gap-4 border-b-1 pb-4 ${className}`}>
      <h2 className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl lg:leading-loose">
        {t("profileImg")}
      </h2>
      <button
        type="button"
        className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]"
        onClick={handleImageClick}
        aria-label={t("profileImg")}
      >
        {selectedImage.dataUrl !== uploadSkeleton ? (
          <Image
            src={selectedImage.dataUrl}
            alt="선택된 프로필 이미지"
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={uploadSkeleton}
            alt="기본 프로필 이미지"
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        )}
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
    </section>
  );
};
