"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getPathWithoutLocale } from "@/utils/locale";

type TTabItem = {
  name: string;
  href: string;
};

interface ITabProps {
  tabList: TTabItem[];
  className?: string;
}

export const Tab = ({ tabList, className = "" }: ITabProps) => {
  const pathname = usePathname();
  const cleanPath = getPathWithoutLocale(pathname);

  return (
    <div className={`border-border-light flex w-full justify-center border-b-[1px] px-6 ${className}`}>
      <nav className="flex w-[var(--breakpoint-lg)] gap-10 overflow-x-auto">
        {tabList.map((tab) => {
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`text-2lg cursor-pointer py-4 font-bold whitespace-nowrap transition-colors ${
                cleanPath === tab.href
                  ? "text-black-500 border-black-500 border-b-2"
                  : "hover:text-black-400 text-gray-500"
              }`}
            >
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
