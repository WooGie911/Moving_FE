"use client"

import { Tab } from "@/components/common/tab/Tab";

const tabList = [
  { name: "작성 가능한 리뷰", href: "/review/writable" },
  { name: "내가 작성한 리뷰", href: "/review/written" },
];

export default function ReviewLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <Tab tabList={tabList} />
        {children}
      </body>
    </html>
  );
}
