import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useLikeToggle } from "@/hooks/useLikeToggle";
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
  disabled?: boolean;
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
  disabled = false, // 기본값은 false
}: IFavoriteProps) => {
  const t = useTranslations("mover");
  
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
      className={`flex items-center justify-center gap-[2px] ${isLoading ? "opacity-50" : ""} ${disabled ? "cursor-default" : "cursor-pointer"}`}
      onClick={handleFavoriteClick}
      disabled={isLoading || disabled}
      aria-pressed={isLiked}
      aria-label={isLiked ? "unfavorite" : "favorite"}
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
