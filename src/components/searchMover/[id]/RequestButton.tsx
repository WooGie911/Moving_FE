import { Button } from "@/components/common/button/Button";
import { useLikeToggle } from "@/hooks/useLikeToggle";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { MoverProps } from "@/types/moverDetail";
import React from "react";

const RequestButton = ({ mover }: MoverProps) => {
  const { isLiked, toggleLike } = useLikeToggle({ moverId: String(mover.id), initialIsLiked: false });
  const deviceType = useWindowWidth();

  return (
    <>
      {deviceType === "desktop" ? (
        <div className="flex flex-col gap-4">
          <p className="text-2lg leading-[26px] font-semibold">
            {mover.nickname} 기사님에게 <br />
            지정 견적을 요청해보세요
          </p>
          <Button variant="solid" width="w-[320px]" height="h-[64px]" rounded="rounded-[16px]" fontSize="text-2lg">
            지정 견적 요청하기
          </Button>
          <Button
            variant="like"
            width="w-[320px]"
            height="h-[54px]"
            rounded="rounded-[16px]"
            isLiked={isLiked}
            onClick={toggleLike}
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
          />
          <Button
            variant="solid"
            width="w-[calc(100%-54px)]"
            height="h-[54px]"
            rounded="rounded-[12px]"
            fontSize="text-lg"
          >
            지정 견적 요청하기
          </Button>
        </div>
      )}
    </>
  );
};

export default RequestButton;
