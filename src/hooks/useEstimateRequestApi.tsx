import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useLanguageStore } from "@/stores/languageStore";
import estimateRequestApi from "@/lib/api/estimateRequest.api";
import { IFormState } from "@/types/estimateRequest";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// API 응답 타입 정의
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  hasActive?: boolean;
}

export const useEstimateRequestApi = () => {
  const { open, close } = useModal();
  const { t } = useLanguageStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 에러 모달 표시
  const showErrorModal = useCallback(
    (message: string) => {
      open({
        title: t("common.error"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{message}</p>
          </div>
        ),
        buttons: [
          {
            text: t("common.confirm"),
            onClick: close,
          },
        ],
      });
    },
    [open, close, t],
  );

  // 성공 모달 표시
  const showSuccessModal = useCallback(
    (message: string, onConfirm?: () => void) => {
      open({
        title: t("common.success"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{message}</p>
          </div>
        ),
        buttons: [
          {
            text: t("common.confirm"),
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

  // 삭제 확인 모달 표시
  const showDeleteConfirmModal = useCallback(
    (onConfirm: () => void) => {
      open({
        title: t("estimateRequest.deleteConfirmTitle"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{t("estimateRequest.deleteConfirmMessage")}</p>
          </div>
        ),
        buttons: [
          {
            variant: "outlined",
            text: t("common.cancel"),
            onClick: close,
          },
          {
            text: t("common.confirm"),
            onClick: () => {
              close();
              onConfirm();
            },
          },
        ],
      });
    },
    [open, close, t],
  );

  // 수정 확인 모달 표시
  const showUpdateConfirmModal = useCallback(
    (onConfirm: () => void) => {
      open({
        title: t("estimateRequest.updateConfirmTitle"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{t("estimateRequest.updateConfirmMessage")}</p>
          </div>
        ),
        buttons: [
          {
            variant: "outlined",
            text: t("common.cancel"),
            onClick: close,
          },
          {
            text: t("common.confirm"),
            onClick: () => {
              close();
              onConfirm();
            },
          },
        ],
      });
    },
    [open, close, t],
  );

  // 개별 항목 수정 확인 모달 표시
  const showEditItemConfirmModal = useCallback(
    (onConfirm: () => void) => {
      open({
        title: t("estimateRequest.editConfirmTitle"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{t("estimateRequest.editConfirmMessage")}</p>
          </div>
        ),
        buttons: [
          {
            variant: "outlined",
            text: t("common.cancel"),
            onClick: close,
          },
          {
            text: t("common.confirm"),
            onClick: () => {
              close();
              onConfirm();
            },
          },
        ],
      });
    },
    [open, close, t],
  );

  // 견적 확정 확인 모달 표시
  const showConfirmEstimateRequestModal = useCallback(
    (onConfirm: () => void) => {
      open({
        title: t("estimateRequest.confirmEstimateRequestTitle"),
        children: (
          <div className="p-6">
            <p className="mb-4 text-gray-700">{t("estimateRequest.confirmEstimateRequestMessage")}</p>
          </div>
        ),
        buttons: [
          {
            variant: "outlined",
            text: t("common.cancel"),
            onClick: close,
          },
          {
            text: t("common.confirm"),
            onClick: () => {
              close();
              onConfirm();
            },
          },
        ],
      });
    },
    [open, close, t],
  );

  // 공통 에러 처리 함수
  const handleApiError = useCallback(
    (error: Error | unknown, defaultMessage: string) => {
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          showErrorModal(errorData.message || defaultMessage);
        } catch {
          showErrorModal(error.message || defaultMessage);
        }
      } else {
        showErrorModal(defaultMessage);
      }
    },
    [showErrorModal],
  );

  // 견적 생성
  const createMutation = useMutation<ApiResponse, Error | unknown, IFormState>({
    mutationFn: (form: IFormState) => estimateRequestApi.create(form),
    onSuccess: (result) => {
      if (result.success) {
        // 세션 데이터 삭제
        localStorage.removeItem("estimateRequest_draft");
        showSuccessModal(t("estimateRequest.createSuccess"), () => {
          window.location.reload();
        });
        queryClient.invalidateQueries({ queryKey: ["estimateRequest", "active"] });
      } else {
        showErrorModal(result.message || "견적 저장에 실패했습니다.");
      }
    },
    onError: (error) => handleApiError(error, "견적 저장에 실패했습니다."),
  });

  // 견적 수정
  const updateMutation = useMutation<ApiResponse, Error | unknown, IFormState>({
    mutationFn: (form: IFormState) => estimateRequestApi.updateActive(form),
    onSuccess: (result) => {
      if (result.success) {
        // 세션 데이터 삭제
        localStorage.removeItem("estimateRequest_draft");
        showSuccessModal(t("estimateRequest.editSuccess"), () => {
          window.location.reload();
        });
        queryClient.invalidateQueries({ queryKey: ["estimateRequest", "active"] });
      } else {
        showErrorModal(result.message || "견적 수정에 실패했습니다.");
      }
    },
    onError: (error) => handleApiError(error, "견적 수정에 실패했습니다."),
  });

  // 견적 삭제
  const deleteMutation = useMutation<ApiResponse, Error | unknown, void>({
    mutationFn: () => estimateRequestApi.cancelActive(),
    onSuccess: (result) => {
      if (result.success) {
        // 세션 데이터 삭제
        localStorage.removeItem("estimateRequest_draft");
        showSuccessModal(t("estimateRequest.deleteSuccess"), () => {
          window.location.reload();
        });
        queryClient.invalidateQueries({ queryKey: ["estimateRequest", "active"] });
      } else {
        showErrorModal(result.message || "견적 삭제에 실패했습니다.");
      }
    },
    onError: (error) => handleApiError(error, "견적 삭제에 실패했습니다."),
  });

  // 활성 견적 요청 조회
  const activeQuery = useQuery<ApiResponse>({
    queryKey: ["estimateRequest", "active"],
    queryFn: () => estimateRequestApi.getActive(),
    staleTime: 60 * 1000,
    retry: false,
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
    activeQuery,
    open,
    close,
  };
};
