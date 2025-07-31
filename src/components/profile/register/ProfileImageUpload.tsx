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

    const fileUrl = await userApi.uploadFilesToS3(file);

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
    <section
      className={`border-border-light flex flex-col gap-4 border-b-1 pb-4 ${className}`}
      aria-label={t("aria.profileImgLabel")}
    >
      <h2 className="text-base leading-relaxed font-semibold text-zinc-800 lg:text-xl">{t("profileImg")}</h2>

      <button
        type="button"
        className="flex h-[100px] w-[100px] cursor-pointer items-center justify-center overflow-hidden rounded-md bg-neutral-100 lg:h-[160px] lg:w-[160px]"
        onClick={handleImageClick}
        aria-label={t("profileImg")}
      >
        {selectedImage.name ? (
          <Image
            src={selectedImage.dataUrl}
            alt={t("aria.selectedProfileImgAlt")}
            width={160}
            height={160}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={uploadSkeleton}
            alt={t("aria.defaultProfileImgAlt")}
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
