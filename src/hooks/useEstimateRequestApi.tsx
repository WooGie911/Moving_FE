import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/common/modal/ModalContext";
import { useTranslations } from "next-intl";
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
  const t = useTranslations();
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
    (result: ApiResponse | Error) => {
      const message = result instanceof Error ? result.message : result.message;
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
        // 견적 생성 완료 후 바로 페이지 새로고침 (모달 없이)
        window.location.reload();
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
        // 견적 수정 완료 후 바로 페이지 새로고침 (모달 없이)
        window.location.reload();
        queryClient.invalidateQueries({ queryKey: ["estimateRequest", "active"] });
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
    mutationFn: () => estimateRequestApi.cancelActive(),
    onSuccess: (result) => {
      if (result.success) {
        // 세션 데이터 삭제
        localStorage.removeItem("estimateRequest_draft");
        // 삭제 완료 후 바로 페이지 새로고침 (모달 없이)
        window.location.reload();
        queryClient.invalidateQueries({ queryKey: ["estimateRequest", "active"] });
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
