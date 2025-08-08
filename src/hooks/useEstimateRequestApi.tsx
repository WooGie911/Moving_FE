import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useTranslations, useLocale } from "next-intl";
import { estimateRequestClientApi } from "@/lib/api/estimateRequest.client";
import { IFormState } from "@/types/estimateRequest";
import { showSuccessToast } from "@/utils/toastUtils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API 응답 타입 정의
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  hasActive?: boolean;
}

// 활성 견적 요청 조회를 위한 별도 훅
export const useActiveEstimateRequest = () => {
  const locale = useLocale();

  return useQuery<ApiResponse>({
    queryKey: ["estimateRequest", "active", locale],
    queryFn: () => estimateRequestClientApi.getActive(locale),
    staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
    retry: false,
  });
};

export const useEstimateRequestApi = () => {
  const { open, close } = useModal();
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 공통 모달 생성 함수
  const createModal = useCallback(
    (title: string, message: string, onConfirm?: () => void, confirmText?: string) => {
      open({
        title,
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{message}</p>
          </div>
        ),
        buttons: [
          ...(onConfirm
            ? [
                {
                  variant: "outlined" as const,
                  text: t("common.cancel"),
                  onClick: close,
                },
              ]
            : []),
          {
            text: confirmText || t("common.confirm"),
            onClick: () => {
              close();
              onConfirm?.();
            },
          },
        ],
      });
    },
    [open, close, t],
  );

  // 에러 모달 표시
  const showErrorModal = useCallback(
    (message: string) => {
      createModal(t("common.error"), message);
    },
    [createModal],
  );

  // 성공 모달 표시
  const showSuccessModal = useCallback(
    (message: string, onConfirm?: () => void) => {
      createModal(t("common.success"), message, onConfirm);
    },
    [createModal],
  );

  // 삭제 확인 모달 표시
  const showDeleteConfirmModal = useCallback(
    (onConfirm: () => void) => {
      createModal(t("estimateRequest.deleteConfirmTitle"), t("estimateRequest.deleteConfirmMessage"), onConfirm);
    },
    [createModal],
  );

  // 수정 확인 모달 표시
  const showUpdateConfirmModal = useCallback(
    (onConfirm: () => void) => {
      createModal(t("estimateRequest.updateConfirmTitle"), t("estimateRequest.updateConfirmMessage"), onConfirm);
    },
    [createModal],
  );

  // 개별 항목 수정 확인 모달 표시
  const showEditItemConfirmModal = useCallback(
    (onConfirm: () => void) => {
      createModal(t("estimateRequest.editConfirmTitle"), t("estimateRequest.editConfirmMessage"), onConfirm);
    },
    [createModal],
  );

  // 견적 확정 확인 모달 표시
  const showConfirmEstimateRequestModal = useCallback(
    (onConfirm: () => void) => {
      createModal(
        t("estimateRequest.confirmEstimateRequestTitle"),
        t("estimateRequest.confirmEstimateRequestMessage"),
        onConfirm,
      );
    },
    [createModal],
  );

  // 기사님 견적 확인 및 pending 리다이렉트 함수
  const checkEstimatesAndRedirect = useCallback(
    (result: ApiResponse | Error | unknown) => {
      const message = result instanceof Error ? result.message : (result as ApiResponse)?.message;
      if (message && message.includes("견적이")) {
        router.push("/estimateRequest/pending");
        return true;
      }
      return false;
    },
    [router],
  );

  // 공통 에러 처리 함수
  const handleApiError = useCallback(
    (error: unknown, defaultMessage: string) => {
      showErrorModal(defaultMessage);
    },
    [showErrorModal],
  );

  // 견적 생성
  const createMutation = useMutation<ApiResponse, Error | unknown, IFormState>({
    mutationFn: (form: IFormState) => estimateRequestClientApi.create(form, locale),
    onSuccess: (result) => {
      if (result.success) {
        // 견적 생성 성공 토스트 표시
        showSuccessToast(t("estimateRequest.createSuccess"));
        // 토스트를 잠시 보여준 후 페이지 새로고침 (한 번만)
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        showErrorModal(result.message || "견적 저장에 실패했습니다.");
      }
    },
    onError: (error) => handleApiError(error, "견적 저장에 실패했습니다."),
  });

  // 견적 수정
  const updateMutation = useMutation<ApiResponse, Error | unknown, IFormState>({
    mutationFn: (form: IFormState) => estimateRequestClientApi.updateActive(form, locale),
    onSuccess: (result) => {
      if (result.success) {
        // 견적 수정 성공 토스트 표시
        showSuccessToast(t("estimateRequest.editSuccess"));
        // 토스트를 잠시 보여준 후 페이지 새로고침 (한 번만)
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // 기사님이 보낸 견적이 있는 경우 pending 페이지로 리다이렉트
        if (!checkEstimatesAndRedirect(result)) {
          showErrorModal(result.message || "견적 수정에 실패했습니다.");
        }
      }
    },
    onError: (error) => {
      // 기사님이 보낸 견적이 있는 경우 pending 페이지로 리다이렉트
      if (!checkEstimatesAndRedirect(error)) {
        handleApiError(error, "견적 수정에 실패했습니다.");
      }
    },
  });

  // 견적 삭제
  const deleteMutation = useMutation<ApiResponse, Error | unknown, void>({
    mutationFn: () => estimateRequestClientApi.cancelActive(locale),
    onSuccess: (result) => {
      if (result.success) {
        // 삭제 성공 토스트 표시
        showSuccessToast(t("estimateRequest.deleteSuccess"));
        // 토스트를 잠시 보여준 후 페이지 새로고침 (한 번만)
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        // 기사님이 보낸 견적이 있는 경우 pending 페이지로 리다이렉트
        if (!checkEstimatesAndRedirect(result)) {
          showErrorModal(result.message || "견적 삭제에 실패했습니다.");
        }
      }
    },
    onError: (error) => {
      // 기사님이 보낸 견적이 있는 경우 pending 페이지로 리다이렉트
      if (!checkEstimatesAndRedirect(error)) {
        handleApiError(error, "견적 삭제에 실패했습니다.");
      }
    },
  });

  return {
    showErrorModal,
    showSuccessModal,
    showDeleteConfirmModal,
    showUpdateConfirmModal,
    showEditItemConfirmModal,
    showConfirmEstimateRequestModal,
    createMutation,
    updateMutation,
    deleteMutation,
    open,
    close,
  };
};
