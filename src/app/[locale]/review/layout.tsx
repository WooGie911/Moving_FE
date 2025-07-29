"use client"

import { Tab } from "@/components/common/tab/Tab";
import { useTranslations } from "next-intl";

export default function ReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const t = useTranslations("review");
  
  const tabList = [
    { name: t("writableTab"), href: "/review/writable" },
    { name: t("writtenTab"), href: "/review/written" },
  ];

  return (
    <div>
      <Tab tabList={tabList} />
      {children}
    </div>
  );
}
