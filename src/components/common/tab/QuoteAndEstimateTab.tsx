import { Tab } from "@/components/common/tab/Tab";
import React from "react";
const UserTab = [
  { name: "대기 중인 견적", href: "/quote/pending" },
  { name: "받았던 견적", href: "/quote/received" },
];
const MoverTab = [
  { name: "보낸 견적 조회", href: "/estimate/request" },
  { name: "반려 요청", href: "/estimate/resolved" },
];

interface IUserType {
  userType: "User" | "Mover";
}

export const QuoteAndEstimateTab = ({ userType }: IUserType) => {
  return <Tab tabList={userType === "User" ? UserTab : MoverTab} />;
};
