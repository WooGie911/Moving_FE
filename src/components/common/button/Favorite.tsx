import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface IFavoriteProps {
  isFavorited: boolean;
  favoriteCount: number;
  moverId: string;
  favoritedColor?: string;
  unfavoritedColor?: string;
  textColor?: string;
  heartPosition?: "left" | "right";
  onFavoriteChange?: () => void;
  onClick?: () => void;
}

const Favorite = ({
  isFavorited: initialIsFavorited,
  favoriteCount,
  moverId,
  favoritedColor = "text-red-500",
  unfavoritedColor = "text-gray-100",
  textColor = "text-gray-500",
  heartPosition = "left",
  onFavoriteChange,
  onClick,
}: IFavoriteProps) => {
  const { isLiked, toggleLike, isLoading } = useLikeToggle({
    moverId: String(moverId),
    initialIsLiked: initialIsFavorited,
    onToggle: onFavoriteChange,
  });

  const heartIcon = isLiked ? (
    <AiFillHeart className={favoritedColor} size={24} />
  ) : (
    <AiOutlineHeart className={unfavoritedColor} size={24} />
  );

  const countText = <span className={`text-md leading-6 font-normal ${textColor}`}>{favoriteCount}</span>;

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isLoading) return;

    await toggleLike();
    onClick?.();
  };

  return (
    <button
      className={`flex cursor-pointer items-center justify-center gap-[2px] ${isLoading ? "opacity-50" : ""}`}
      onClick={handleFavoriteClick}
      disabled={isLoading}
    >
      {heartPosition === "left" ? (
        <>
          {heartIcon}
          {countText}
        </>
      ) : (
        <>
          {countText}
          {heartIcon}
        </>
      )}
    </button>
  );
};

export default Favorite;
