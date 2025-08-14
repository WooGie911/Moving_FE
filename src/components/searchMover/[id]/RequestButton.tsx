import { Button } from "@/components/common/button/Button";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { MoverProps } from "@/types/mover.types";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import findMoverApi from "@/lib/api/findMover.api";
import { useRouter } from "next/navigation";
import { showSuccessToast, showErrorToast } from "@/utils/toastUtils";

interface RequestButtonProps extends MoverProps {
  estimateRequestId?: string;
  onMoverUpdate?: () => void;
}

const RequestButton = ({ mover, estimateRequestId, onMoverUpdate }: RequestButtonProps) => {
  const { isLiked, toggleLike, isLoading } = useLikeToggle({
    moverId: String(mover.id),
    initialIsLiked: mover.isFavorited || false,
    onToggle: onMoverUpdate,
  });
  const deviceType = useWindowWidth();
  const { isLoggedIn } = useAuth();
  const { open, close } = useModal();
  const router = useRouter();
  const locale = useLocale();
  const [isRequesting, setIsRequesting] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);
  const [requestStatus, setRequestStatus] = useState<string | null>(null);
  const t = useTranslations("mover");

  // 견적 상태 확인 (확정/완료된 견적은 지정 견적 요청 불가)
  const isEstimateApproved =
    mover.activeEstimateRequest?.status === "APPROVED" || mover.activeEstimateRequest?.status === "批准";
  const isEstimateCompleted =
    mover.activeEstimateRequest?.status === "COMPLETED" || mover.activeEstimateRequest?.status === "完成";

  // 지정견적요청 상태 확인 (반려된 경우는 다시 요청 가능하므로 alreadyRequested만 체크)
  const isDesignatedRequestDisabled = alreadyRequested || isEstimateApproved || isEstimateCompleted;

  useEffect(() => {
    const checkDesignatedRequest = async () => {
      if (!isLoggedIn || !estimateRequestId) {
        setAlreadyRequested(false);
        return;
      }
      try {
        const requestCheck = await findMoverApi.checkDesignatedQuoteRequest(
          String(mover.id),
          String(estimateRequestId),
        );
        setAlreadyRequested(requestCheck.hasRequested);
        setRequestStatus(requestCheck.status);
      } catch (error) {
        setAlreadyRequested(false);
        setRequestStatus(null);
      }
    };
    checkDesignatedRequest();
  }, [mover.id, isLoggedIn, estimateRequestId]);

  // 지정 견적 요청
  const handleDesignateRequest = async () => {
    // 견적이 확정되거나 완료된 경우 함수 실행하지 않음
    if (isEstimateApproved || isEstimateCompleted) {
      return;
    }

    if (!isLoggedIn) {
      open({
        title: t("loginRequired"),
        children: <>{t("loginRequiredMessage")}</>,
        buttons: [
          {
            text: t("loginButton"),
            onClick: () => {
              close();
              router.push("/userSignin");
            },
          },
        ],
      });
      return;
    }

    // 이사일이 지나지 않은 견적이 있는지 확인 (견적이 확정된 상태이고 이사일이 지나지 않은 경우)
    if (estimateRequestId && isEstimateApproved) {
      try {
        const activeRequestCheck = await findMoverApi.checkActiveEstimateRequest();
        if (activeRequestCheck.hasActiveRequest) {
          open({
            title: t("estimateRequestLimit"),
            children: <>{t("activeEstimateExists")}</>,
            buttons: [{ text: t("confirmButton"), onClick: close }],
          });
          return;
        }
      } catch (error) {
        console.error("이사일이 지나지 않은 견적 확인 실패:", error);
      }
    }

    if (!estimateRequestId) {
      open({
        title: t("requestDesignatedQuoteButton"),
        children: <>{t("generalQuoteRequired")}</>,
        buttons: [
          {
            text: t("requestGeneralQuoteButton"),
            onClick: () => {
              close();
              router.push("/estimateRequest/create");
            },
          },
        ],
      });
      return;
    }

    setIsRequesting(true);
    try {
      // 만료일 설정 (7일 후)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await findMoverApi.requestDesignatedQuote(String(mover.id), {
        quoteId: String(estimateRequestId),
        message: "기사님께 지정 견적을 요청합니다.",
        expiresAt: expiresAt.toISOString(),
      });
      showSuccessToast(t("requestSuccessMessage"));
      setAlreadyRequested(true);

      // 성공 후 상태 다시 확인
      const requestCheck = await findMoverApi.checkDesignatedQuoteRequest(String(mover.id), String(estimateRequestId));
      setAlreadyRequested(requestCheck.hasRequested);
    } catch (err: any) {
      if (err.message && err.message.includes("이미")) {
        setAlreadyRequested(true);
        showErrorToast(t("alreadyRequestedMessage"));
      } else {
        showErrorToast(err.message || t("requestFailedMessage"));
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <section role="group" aria-labelledby="request-actions-title">
      <h3 id="request-actions-title" className="sr-only">
        견적 요청 및 찜하기
      </h3>
      {deviceType === "desktop" ? (
        <div className="flex flex-col gap-4">
          <p className="text-2lg leading-[26px] font-semibold" role="text">
            {mover.nickname} {t("driverSuffix")} {t("to")} <br />
            {t("requestDesignatedQuote")}
          </p>
          <Button
            variant="solid"
            width="w-[320px]"
            height="h-[64px]"
            rounded="rounded-[16px]"
            fontSize="text-2lg"
            onClick={handleDesignateRequest}
            disabled={isRequesting || isDesignatedRequestDisabled}
          >
            {isEstimateApproved
              ? t("estimateConfirmed")
              : isEstimateCompleted
                ? t("estimateCompleted")
                : alreadyRequested && requestStatus === "REJECTED"
                  ? t("requestRejected")
                  : alreadyRequested
                    ? t("alreadyRequested")
                    : t("requestDesignatedQuoteButton")}
          </Button>
          <Button
            variant="like"
            width="w-[320px]"
            height="h-[64px]"
            rounded="rounded-[16px]"
            isLiked={isLiked}
            onClick={toggleLike}
            disabled={isLoading}
          />
        </div>
      ) : (
        <div className="mb-20 flex w-full gap-2">
          <Button
            variant="like"
            width="w-[54px]"
            height="h-[54px]"
            rounded="rounded-[16px]"
            isLiked={isLiked}
            onClick={toggleLike}
            disabled={isLoading}
          />
          <Button
            variant="solid"
            width="w-[calc(100%-54px)]"
            height="h-[54px]"
            rounded="rounded-[12px]"
            fontSize="text-lg"
            onClick={handleDesignateRequest}
            disabled={isRequesting || isDesignatedRequestDisabled}
          >
            {isEstimateApproved
              ? t("estimateConfirmed")
              : isEstimateCompleted
                ? t("estimateCompleted")
                : alreadyRequested && requestStatus === "REJECTED"
                  ? t("requestRejected")
                  : alreadyRequested
                    ? t("alreadyRequested")
                    : t("requestDesignatedQuoteButton")}
          </Button>
        </div>
      )}
    </section>
  );
};

export default RequestButton;
