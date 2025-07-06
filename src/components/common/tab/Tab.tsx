"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type TTabItem = {
  name: string;
  href: string;
};

type TTabProps = {
  tabList: TTabItem[];
};

export const Tab = ({ tabList }: TTabProps) => {
  const pathname = usePathname();

  return (
    <div className="flex w-full justify-center px-6">
      <nav className="flex w-[var(--breakpoint-lg)] gap-10 overflow-x-auto">
        {tabList.map((tab) => (
          <Link
            key={tab.name}
            href={tab.href}
            className={`text-2lg cursor-pointer py-4 font-bold whitespace-nowrap transition-colors ${
              pathname === tab.href
                ? "text-black-500 border-black-500 border-b-2"
                : "hover:text-black-400 text-gray-500"
            }`}
          >
            {tab.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};
