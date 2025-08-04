import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import FavoriteService, { IFavoriteStatus } from "../../../services/favoriteService";

interface IFavoriteProps {
  isFavorited: boolean;
  favoriteCount: number;
  moverId: string;
  favoritedColor?: string;
  unfavoritedColor?: string;
  textColor?: string;
  heartPosition?: "left" | "right";
  onFavoriteChange?: (status: IFavoriteStatus) => void;
  onClick?: () => void; // 부모 컴포넌트에서 전달받는 onClick
  disabled?: boolean; // 클릭 비활성화 옵션 추가
}

const Favorite = ({
  isFavorited: initialIsFavorited,
  favoriteCount: initialFavoriteCount,
  moverId,
  favoritedColor = "text-red-500",
  unfavoritedColor = "text-gray-100",
  textColor = "text-gray-500",
  heartPosition = "left",
  onFavoriteChange,
  onClick,
  disabled = false, // 기본값은 false
}: IFavoriteProps) => {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [favoriteCount, setFavoriteCount] = useState(initialFavoriteCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 이벤트 전파 방지
    e.preventDefault(); // 기본 동작 방지

    if (isLoading || disabled) return; // disabled 상태일 때도 클릭 방지

    setIsLoading(true);
    try {
      let response;

      if (isFavorited) {
        // 찜하기 제거
        response = await FavoriteService.removeFavorite(moverId);
      } else {
        // 찜하기 추가
        response = await FavoriteService.addFavorite(moverId);
      }

      if (response.success && response.data) {
        setIsFavorited(response.data.isFavorited);
        setFavoriteCount(response.data.favoriteCount);

        // 부모 컴포넌트에 상태 변경 알림
        onFavoriteChange?.(response.data);

        // 부모 컴포넌트의 onClick 호출
        onClick?.();
      }
    } catch (error) {
      console.error("찜하기 처리 오류:", error);
      // 에러 발생 시 원래 상태로 되돌리기
      setIsFavorited(initialIsFavorited);
      setFavoriteCount(initialFavoriteCount);
    } finally {
      setIsLoading(false);
    }
  };

  const heartIcon = isFavorited ? (
    <AiFillHeart className={favoritedColor} size={24} />
  ) : (
    <AiOutlineHeart className={unfavoritedColor} size={24} />
  );

  const countText = <span className={`text-md leading-6 font-normal ${textColor}`}>{favoriteCount}</span>;

  return (
    <button
      className={`flex items-center justify-center gap-[2px] ${isLoading ? "opacity-50" : ""} ${disabled ? "cursor-default" : "cursor-pointer"}`}
      onClick={handleFavoriteClick}
      disabled={isLoading || disabled}
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
