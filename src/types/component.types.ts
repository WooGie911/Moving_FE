// 공통 컴포넌트 props
export interface LoadingProps {
  isLoading?: boolean;
}

export interface ErrorProps {
  error?: string | null;
  onRetry?: () => void;
}
