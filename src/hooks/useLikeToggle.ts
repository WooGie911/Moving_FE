"use client";

import { useState, useEffect } from "react";
import { IUseLikeToggleProps } from "@/types/button";
import findMoverApi from "@/lib/api/findMover.api";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";

export const useLikeToggle = ({ moverId, initialIsLiked = false, onToggle }: IUseLikeToggleProps) => {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoggedIn } = useAuth();
  const { open, close } = useModal();
  const router = useRouter();

  useEffect(() => {
    setIsLiked(initialIsLiked);
  }, [initialIsLiked]);

  const toggleLike = async () => {
    if (!isLoggedIn) {
      open({
        title: "로그인 필요",
        children: "로그인 후 찜하기 기능을 이용할 수 있습니다.",
        buttons: [
          {
            text: "로그인 하기",
            onClick: () => {
              close();
              router.push("/userSignin");
            },
          },
        ],
      });
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      if (isLiked) {
        // 찜하기 해제
        const result = await findMoverApi.removeFavorite(moverId);
        setIsLiked(result.isFavorited);
        console.log(`${moverId} 찜 해제 완료`);
      } else {
        // 찜하기 등록
        const result = await findMoverApi.addFavorite(moverId);
        setIsLiked(result.isFavorited);
        console.log(`${moverId} 찜 등록 완료`);
      }

      if (onToggle) {
        onToggle();
      }
    } catch (error: any) {
      console.error("찜하기 토글 실패:", error);
      open({
        title: "오류",
        children: error.message || "찜하기 처리에 실패했습니다.",
        buttons: [{ text: "확인", onClick: close }],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLiked,
    toggleLike,
    isLoading,
  };
};
