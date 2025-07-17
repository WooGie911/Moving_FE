import Image from "next/image";
import React from "react";
import like from "@/assets/icon/like/icon-like-black.png";
import { Button } from "@/components/common/button/Button";
export const LastButtonSection = () => {
  return (
    <div className="flex w-full flex-row items-center justify-center gap-2 py-7">
      <button className="border-border-light flex h-[54px] w-[54px] flex-row items-center justify-center rounded-[16px] border-1 lg:hidden">
        <div className="relative h-6 w-6">
          <Image src={like} alt="like" fill />
        </div>
      </button>
      <Button variant="solid" width="w-full" height="h-[54px]" rounded="rounded-[8px]">
        견적 확정하기
      </Button>
    </div>
  );
};
