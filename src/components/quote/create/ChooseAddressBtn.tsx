import React from "react";

interface IChooseAddressBtnProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const ChooseAddressBtn = ({ children, onClick }: IChooseAddressBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "border-primary-400 text-primary-400 h-[54px] w-full items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none"
      }
    >
      {children}
    </button>
  );
};

export default ChooseAddressBtn;
