"use client";
import Image from "next/image";
import React from "react";
import sort_active from "@/assets/icon/filter/icon-filter-active.png";
import sort_inactive from "@/assets/icon/filter/icon-filter-inactive.png";
import { useModal, useModalStore } from "@/components/common/modal/ModalContext";
import { SelectCheckBox } from "./SelectCheckBox";
import { SelectMovinType } from "./SelectMovinType";
import { useWindowWidth } from "@/hooks/useWindowWidth";
import { Dropdown } from "./Dropdown";

export const SmallFilterSection = () => {
  const { open, close } = useModal();
  const modal = useModalStore((state) => state.modal);
  const deviceType = useWindowWidth();

  // 화면이 desktop(lg)이상이면 모달 자동 close
  React.useEffect(() => {
    if (modal && deviceType === "desktop") {
      close();
    }
  }, [deviceType, modal, close]);

  return (
    <div className="flex w-full flex-row justify-between">
      <p>{`전체 ${30}건`}</p>
      <div className="flex flex-row items-center justify-center gap-1">
        {/* 정렬 버튼 */}
        <Dropdown />

        <button
          className="relative h-[32px] w-[32px]"
          onClick={() =>
            open({
              title: "필터",
              children: (
                <div className="flex flex-col items-start justify-center gap-4">
                  {/* 이사유형 라벨 선택 영역 */}
                  <div className="flex flex-col items-start justify-center gap-2 pb-7">
                    <p className="text-black-500 text-[16px] leading-[26px] font-semibold">이사 유형</p>
                    <SelectMovinType />
                  </div>
                  <div className="flex flex-col items-start justify-center gap-2">
                    <p className="text-black-500 text-[16px] leading-[26px] font-semibold">지역 및 견적 </p>
                    <SelectCheckBox />
                  </div>
                </div>
              ),
              type: "bottomSheet", // "center" | "bottomSheet" (생략 시 기본값: "center")
              buttons: [
                {
                  text: "조회하기",
                  onClick: () => {
                    /* 원하는 동작 */
                  },
                  disabled: false, // 선택사항
                },
                // ...필요시 여러 버튼 추가 가능
              ],
            })
          }
        >
          <Image src={modal ? sort_active : sort_inactive} alt="sortModal" fill className="object-contain" />
        </button>
      </div>
    </div>
  );
};
