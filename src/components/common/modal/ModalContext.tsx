"use client";

import React from "react";
import { Button } from "@/components/common/button/Button";
import type { IModalButton, IModalOptions } from "@/types/modal";
import { create } from "zustand";

// zustand store 정의
interface IModalStore {
  modal: IModalOptions | null;
  open: (options: IModalOptions) => void;
  close: () => void;
}

export const useModalStore = create<IModalStore>((set) => ({
  modal: null,
  open: (options) => set({ modal: options }),
  close: () => set({ modal: null }),
}));

export function useModal() {
  const open = useModalStore((state) => state.open);
  const close = useModalStore((state) => state.close);
  return { open, close };
}

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const modal = useModalStore((state) => state.modal);
  const close = useModalStore((state) => state.close);

  return (
    <>
      {children}
      {modal && <ModalLayout {...modal} onClose={close} />}
    </>
  );
}

function ModalLayout({ title, children, buttons, onClose, type = "center" }: IModalOptions & { onClose: () => void }) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = React.useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose],
  );

  const [responsiveType, setResponsiveType] = React.useState(type);

  React.useEffect(() => {
    function handleResize() {
      if (type === "bottomSheet") {
        setResponsiveType(window.innerWidth < 768 ? "bottomSheet" : "center");
      } else {
        setResponsiveType(type);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [type, title, children, buttons]);

  const modalClass =
    responsiveType === "bottomSheet"
      ? "fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl bg-gray-50 px-4 py-6 shadow-xl transition-all duration-300 ease-out w-full max-w-md mx-auto"
      : "relative min-w-[293px] rounded-3xl bg-gray-50 px-4 py-6 shadow-xl transition-all duration-300 ease-out md:min-w-152 md:px-6 md:pt-8 md:pb-10";

  const wrapperClass =
    responsiveType === "bottomSheet"
      ? "fixed inset-0 z-50 flex items-end justify-center bg-black/50"
      : "fixed inset-0 z-50 flex items-center justify-center bg-black/50";

  return (
    <div className={wrapperClass} onClick={handleBackdropClick}>
      <div className={modalClass}>
        {/* 헤더 */}
        <div className="mb-[30px] flex items-center justify-between md:mb-[42px]">
          <h2 className="text-2lg truncate pr-4 leading-[26px] font-bold md:text-2xl md:leading-8 md:font-semibold">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 cursor-pointer rounded-full p-1 text-gray-400 transition-colors"
            aria-label="모달 닫기"
          >
            <svg
              className="h-6 w-6 md:h-9 md:w-9"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        {/* 내용 */}
        <div className="text-2lg text-black-300 mb-6 leading-[26px] font-medium md:mb-10">{children}</div>
        {/* 하단 버튼 */}
        {buttons && (
          <div className="flex gap-2">
            {buttons.map((btn, i) => (
              <Button
                key={i}
                variant="solid"
                onClick={btn.onClick}
                disabled={btn.disabled}
                width="w-full"
                height="h-[54px] md:h-16 "
                rounded="rounded-xl md:rounded-2xl "
                fontSize="text-base md:text-2lg"
              >
                {btn.text}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
