"use client";

import React, { useEffect, useRef } from "react";
import { IoClose } from "react-icons/io5";

interface IUserActionDropdownProps {
  type: "alert" | "info";
  onClose?: () => void;
  isOpen?: boolean;
  children?: React.ReactNode;
  name?: string;
}

// 공통 드롭다운 컨테이너 컴포넌트
const DropdownContainer = ({
  children,
  className = "",
  rounded = "rounded-16",
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
}) => (
  <div
    className={`inline-flex flex-col items-start justify-start border border-gray-200 bg-white px-4 py-2.5 shadow-[2px_2px_8px_0px_rgba(224,224,224,0.20)] ${rounded} overflow-hidden ${className}`}
  >
    {children}
  </div>
);

// 공통 헤더 컴포넌트
const DropdownHeader = ({
  title,
  onClose,
  showCloseButton = true,
}: {
  title: string;
  onClose?: () => void;
  showCloseButton?: boolean;
}) => (
  <div className="inline-flex w-full items-center justify-between bg-white py-3.5 pr-3 pl-4">
    <div className="flex items-center justify-start">
      <div className="leading-2lg text-black-400 lg:text-2lg text-left text-base font-bold">{title}</div>
    </div>
    {showCloseButton && onClose && (
      <button
        onClick={onClose}
        className="flex h-6 w-6 items-center justify-center text-gray-400 transition-colors hover:text-gray-600"
        aria-label="닫기"
      >
        <IoClose size={20} />
      </button>
    )}
  </div>
);

// 공통 메뉴 아이템 컴포넌트
const MenuItem = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div className={`border-b border-neutral-200 bg-white px-4 py-3 ${className}`} onClick={onClick}>
    {children}
  </div>
);

const UserActionDropdown = ({ type, onClose, isOpen, children, name }: IUserActionDropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // ESC 키로 닫기
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  // 외부 클릭으로 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) && isOpen) {
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="" ref={dropdownRef}>
      {type === "alert" ? (
        <DropdownContainer className="w-72 lg:w-[359px]" rounded="rounded-24">
          <DropdownHeader title="알림" onClose={onClose} />
          {children}
        </DropdownContainer>
      ) : (
        <DropdownContainer className="w-38 lg:w-62" rounded="rounded-16">
          <DropdownHeader title={`${name || "사용자"} 고객님`} onClose={onClose} showCloseButton={false} />
          {children}
        </DropdownContainer>
      )}
    </div>
  );
};

export default UserActionDropdown;
