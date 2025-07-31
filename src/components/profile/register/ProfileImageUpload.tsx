"use client";

import Image from "next/image";
import React, { useRef } from "react";
import uploadSkeleton from "@/assets/img/etc/profile-upload-skeleton.png";
import userApi from "@/lib/api/user.api";
import { useTranslations } from "next-intl";

interface IProfileImageUploadProps {
  onImageChange: (imageData: { name: string; type: string; dataUrl: string }) => void;
  selectedImage: { name: string; type: string; dataUrl: string };
  className?: string;
}

export const ProfileImageUpload = ({ onImageChange, selectedImage, className = "" }: IProfileImageUploadProps) => {
  const t = useTranslations("profile");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // 1. presigned URL 요청 및 s3 업로드
    const fileUrl = await userApi.uploadFilesToS3(file);

    // 2. 미리보기 이미지와 메타데이터 저장
    const reader = new FileReader();
    reader.onload = () => {
      onImageChange({
        name: file.name,
        type: file.type,
        dataUrl: fileUrl,
      });
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className={`border-border-light flex flex-col gap-4 border-b-1 pb-4 ${className}`}>
      <div className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl">{t("profileImg")}</div>
      <div
        className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]"
        onClick={handleImageClick}
      >
        {selectedImage.name ? (
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
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
    </div>
  );
};
