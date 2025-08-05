import { toast } from "react-toastify";

/**
 * 성공 토스트 알림 (브랜드 오렌지 색상 + 체크 아이콘)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const showSuccessToast = (message: string, options?: any) => {
  toast.success(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    icon: "✓",
    ...options,
  });
};

/**
 * 에러 토스트 알림 (빨간색 + X 아이콘)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const showErrorToast = (message: string, options?: any) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    icon: "✕",
    ...options,
  });
};

/**
 * 경고 토스트 알림
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const showWarningToast = (message: string, options?: any) => {
  toast.warning(message, {
    position: "top-center",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    ...options,
  });
};

/**
 * 정보 토스트 알림 (브랜드 오렌지 색상 + 정보 아이콘)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const showInfoToast = (message: string, options?: any) => {
  toast.info(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    icon: "ℹ",
    ...options,
  });
};

/**
 * 기본 토스트 알림 (브랜드 오렌지 색상)
 * @param message - 표시할 메시지
 * @param options - 추가 옵션
 */
export const showCustomToast = (message: string, options?: any) => {
  toast(message, {
    position: "top-center",
    autoClose: 2000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    icon: "✓",
    ...options,
  });
};

/**
 * 모든 토스트 제거
 */
export const clearAllToasts = () => {
  toast.dismiss();
};
