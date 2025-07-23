import { Button } from "@/components/common/button/Button";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { MoverProps } from "@/types/mover.types";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";
import { useModal } from "@/components/common/modal/ModalContext";
import findMoverApi from "@/lib/api/findMover.api";
import { useRouter } from "next/navigation";

interface RequestButtonProps extends MoverProps {
  quoteId?: string;
  onMoverUpdate?: () => void;
}

const RequestButton = ({ mover, quoteId, onMoverUpdate }: RequestButtonProps) => {
  const { isLiked, toggleLike, isLoading } = useLikeToggle({
    moverId: String(mover.id),
    initialIsLiked: mover.isFavorited || false,
    onToggle: onMoverUpdate,
  });
  const deviceType = useWindowWidth();
  const { isLoggedIn } = useAuth();
  const { open, close } = useModal();
  const router = useRouter();
  const [isRequesting, setIsRequesting] = useState(false);
  const [alreadyRequested, setAlreadyRequested] = useState(false);

  useEffect(() => {
    const checkDesignatedRequest = async () => {
      if (!isLoggedIn || !quoteId) {
        setAlreadyRequested(false);
        return;
      }
      try {
        const requestCheck = await findMoverApi.checkDesignatedQuoteRequest(String(mover.id), String(quoteId));
        setAlreadyRequested(requestCheck.hasRequested);
      } catch (error) {
        setAlreadyRequested(false);
      }
    };
    checkDesignatedRequest();
  }, [mover.id, isLoggedIn, quoteId]);

  // 지정 견적 요청
  const handleDesignateRequest = async () => {
    if (!isLoggedIn) {
      open({
        title: "로그인 필요",
        children: <>로그인 후 이용 가능합니다.</>,
        buttons: [
          {
            text: "로그인 하기",
            onClick: () => {
              close();
              router.push("/userSignin");
            },
          },
        ],
      });
      return;
    }
    if (!quoteId) {
      open({
        title: "지정 견적 요청하기",
        children: <>일반 견적 요청을 먼저 진행해 주세요.</>,
        buttons: [
          {
            text: "일반 견적 요청 하기",
            onClick: () => {
              close();
              router.push("/quote/create");
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
        quoteId: String(quoteId),
        message: "기사님께 지정 견적을 요청합니다.",
        expiresAt: expiresAt.toISOString(),
      });
      open({
        title: "지정 견적 요청 완료",
        children: <>지정 견적 요청이 성공적으로 완료되었습니다.</>,
        buttons: [{ text: "확인", onClick: close }],
      });
      setAlreadyRequested(true);
    } catch (err: any) {
      if (err.message && err.message.includes("이미")) {
        setAlreadyRequested(true);
        open({
          title: "이미 요청됨",
          children: <>이미 이 기사님에게 지정 견적을 요청하셨습니다.</>,
          buttons: [{ text: "확인", onClick: close }],
        });
      } else {
        open({
          title: "오류",
          children: <>{err.message || "지정 견적 요청에 실패했습니다."}</>,
          buttons: [{ text: "확인", onClick: close }],
        });
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      {deviceType === "desktop" ? (
        <div className="flex flex-col gap-4">
          <p className="text-2lg leading-[26px] font-semibold">
            {mover.nickname} 기사님에게 <br />
            지정 견적을 요청해보세요
          </p>
          <Button
            variant="solid"
            width="w-[320px]"
            height="h-[64px]"
            rounded="rounded-[16px]"
            fontSize="text-2lg"
            onClick={handleDesignateRequest}
            disabled={isRequesting || alreadyRequested}
          >
            지정 견적 요청하기
          </Button>
          <Button
            variant="like"
            width="w-[320px]"
            height="h-[54px]"
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
            disabled={isRequesting || alreadyRequested}
          >
            {alreadyRequested ? "이미 요청됨" : "지정 견적 요청하기"}
          </Button>
        </div>
      )}
    </>
  );
};

export default RequestButton;
