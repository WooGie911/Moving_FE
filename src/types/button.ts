import { ReactNode } from "react";

// 버튼 상태 타입
export type TSolidState = "default" | "disabled";
export type TOutlinedState = "default" | "active" | "done";

// 버튼 variant 타입
export type TButtonVariant = "solid" | "outlined" | "like";

// 버튼 Props 인터페이스
export interface IButtonProps {
  variant: TButtonVariant;
  state?: TSolidState | TOutlinedState;
  children?: ReactNode;
  onClick?: () => void;
  isEditButton?: boolean;
  className?: string;
  disabled?: boolean;
  isLiked?: boolean;
}

// 찜 토글 훅 Props 인터페이스
export interface IUseLikeToggleProps {
  moverId: string;
  initialIsLiked?: boolean;
}
