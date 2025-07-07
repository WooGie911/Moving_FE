import { Tab } from "@/components/common/tab/Tab";
import React, { Children } from "react";
const UserTabList = [
  { name: "대기 중인 견적", href: "/estimate/list/user/waiting" },
  { name: "받았던 견적", href: "/estimate/list/user/received" },
];
const MoverTabList = [
  { name: "보낸 견적 조회", href: "/estimate/list/mover/requested" },
  { name: "반려 요청", href: "/estimate/list/mover/rejected" },
];

interface IUserType {
  userType: "User" | "Mover";
  children: React.ReactNode;
}

export const ListPage = ({ userType, children }: IUserType) => {
  return (
    <>
      <Tab tabList={userType === "User" ? UserTabList : MoverTabList} />
      {children}
    </>
  );
};
