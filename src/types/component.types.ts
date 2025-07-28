// 공통 컴포넌트 props
export interface ILoadingProps {
  isLoading?: boolean;
}

export interface IErrorProps {
  error?: string | null;
  onRetry?: () => void;
}
