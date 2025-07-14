import React from "react";
import { IChooseAddressBtnProps } from "@/types/quote";

const ChooseAddressBtn = ({ children, onClick, className = "" }: IChooseAddressBtnProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border-primary-400 text-primary-400 h-[54px] w-full cursor-pointer items-center rounded-2xl border px-6 text-left text-base leading-[26px] font-semibold transition-colors focus:outline-none ${className}`}
    >
      {children}
    </button>
  );
};

export default ChooseAddressBtn;
