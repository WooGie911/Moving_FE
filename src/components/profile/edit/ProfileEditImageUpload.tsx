"use client";

import React, { useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import userApi from "@/lib/api/user.api";
import { showWarningToast } from "@/utils/toastUtils";
import { renameFileWithTimestamp } from "@/utils/fileName";

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

  const handleImageClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleImageChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        showWarningToast(t("imageUploadError"));
        return;
      }

      const renamedFile = renameFileWithTimestamp(file);
      console.log("renamedFile", renamedFile);
      const fileUrl = await userApi.uploadFilesToS3(renamedFile);

      onImageChange({
        name: renamedFile.name,
        type: renamedFile.type,
        dataUrl: fileUrl,
      });
    },
    [onImageChange, t],
  );

  const imageSrc = useMemo(
    () => (selectedImage.dataUrl === uploadSkeleton ? uploadSkeleton : selectedImage.dataUrl),
    [selectedImage.dataUrl, uploadSkeleton],
  );

  const imageAlt = selectedImage.dataUrl === uploadSkeleton ? "기본 프로필 이미지" : "선택된 프로필 이미지";

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
        <Image src={imageSrc} alt={imageAlt} width={160} height={160} className="h-full w-full object-cover" />
      </button>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
    </section>
  );
};
