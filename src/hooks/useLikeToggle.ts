"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { IUseLikeToggleProps } from "@/types/button";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useAddFavorite, useRemoveFavorite } from "./useMoverData";
import { showErrorToast } from "@/utils/toastUtils";

export const useLikeToggle = ({ moverId, initialIsLiked = false, onToggle }: IUseLikeToggleProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isProcessing, setIsProcessing] = useState(false);
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

    // 중복 요청 방지
    if (isProcessing || addFavoriteMutation.isPending || removeFavoriteMutation.isPending) {
      return;
    }

    setIsProcessing(true);

    try {
      if (isLiked) {
        // 찜하기 해제
        await removeFavoriteMutation.mutateAsync(moverId);
        setIsLiked(false);
      } else {
        // 찜하기 등록
        await addFavoriteMutation.mutateAsync(moverId);
        setIsLiked(true);
      }

      if (onToggle) {
        onToggle();
      }
    } catch (error: any) {
      console.error("찜하기 토글 실패:", error);

      // 에러 메시지를 토스트로 표시
      showErrorToast(error.message || t("likeFailedMessage"));
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isLiked,
    toggleLike,
    isLoading: isProcessing || addFavoriteMutation.isPending || removeFavoriteMutation.isPending,
  };
};
