import { ReactNode } from "react";

// 버튼 상태 타입
export type TSolidState = "default" | "disabled";
export type TOutlinedState = "default" | "active" | "done";

// 버튼 variant 타입
export type TButtonVariant = "solid" | "outlined" | "like";

// 공유 버튼 타입
export type TShareType = "clip" | "kakao" | "facebook";

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

// 공유 버튼 Props 인터페이스
export interface IShareButtonProps {
  type: TShareType;
  url?: string; // 현재 페이지 URL 자동 사용
  title?: string; // TODO: 추후 API 연동 시 사용
  description?: string; // TODO: 추후 API 연동 시 사용
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// 공유 버튼 그룹 Props 인터페이스
export interface IShareButtonGroupProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// 찜 토글 훅 Props 인터페이스
export interface IUseLikeToggleProps {
  moverId: string;
  initialIsLiked?: boolean;
}

// 체크필터 Props 인터페이스
export interface CheckFilterProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  className?: string;
}
