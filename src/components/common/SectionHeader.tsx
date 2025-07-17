import React, { Children } from "react";

interface ISectionHeaderProps {
  children: React.ReactNode;
}

const SectionHeader = ({ children }: ISectionHeaderProps) => {
  return <div className="static flex h-20 w-full border-b border-[#f2f2f2] bg-white">{children}</div>;
};

export default SectionHeader;
