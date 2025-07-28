"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { IUseLikeToggleProps } from "@/types/button";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useAddFavorite, useRemoveFavorite } from "./useMoverData";

export const useLikeToggle = ({ moverId, initialIsLiked = false, onToggle }: IUseLikeToggleProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { isLoggedIn } = useAuth();
  const { open, close } = useModal();
  const router = useRouter();
  const t = useTranslations("mover");

  // React Query mutations
  const addFavoriteMutation = useAddFavorite();
  const removeFavoriteMutation = useRemoveFavorite();

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const toggleLike = async () => {
    if (!isLoggedIn) {
      open({
        title: t("loginRequired"),
        children: t("likeLoginRequiredMessage"),
        buttons: [
          {
            text: t("loginButton"),
            onClick: () => {
              close();
              router.push("/userSignin");
            },
          },
        ],
      });
      return;
    }

    if (addFavoriteMutation.isPending || removeFavoriteMutation.isPending) return;

    try {
      if (isLiked) {
        // 찜하기 해제
        const result = await removeFavoriteMutation.mutateAsync(moverId);
        setIsLiked(result.isFavorited);
        console.log(`${moverId} 찜 해제 완료`);
      } else {
        // 찜하기 등록
        const result = await addFavoriteMutation.mutateAsync(moverId);
        setIsLiked(result.isFavorited);
        console.log(`${moverId} 찜 등록 완료`);
      }

      if (onToggle) {
        onToggle();
      }
    } catch (error: any) {
      console.error("찜하기 토글 실패:", error);
      open({
        title: t("likeErrorTitle"),
        children: error.message || t("likeFailedMessage"),
        buttons: [{ text: t("confirmButton"), onClick: close }],
      });
    }
  };

  return {
    isLiked,
    toggleLike,
    isLoading: addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
};
