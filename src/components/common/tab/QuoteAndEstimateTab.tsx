import { Tab } from "@/components/common/tab/Tab";
import React from "react";

const UserTab = [
  { name: "대기 중인 견적", href: "/quote/pending" },
  { name: "받았던 견적", href: "/quote/received" },
];

const MoverTab = [
  { name: "보낸 견적 조회", href: "/estimate/request" },
  { name: "반려 요청", href: "/estimate/rejected" },
];

const DetailTab = [{ name: "견적 상세", href: "" }];

const MoverReceivedTab = [{ name: "받은 요청", href: "/estimate/received" }];

interface IUserType {
  userType: "User" | "Mover" | "Detail" | "MoverReceived";
}

export const QuoteAndEstimateTab = ({ userType }: IUserType) => {
  const getTabList = () => {
    switch (userType) {
      case "User":
        return UserTab;
      case "Mover":
        return MoverTab;
      case "Detail":
        return DetailTab;
      case "MoverReceived":
        return MoverReceivedTab;
      default:
        return UserTab;
    }
  };

  return <Tab tabList={getTabList()} />;
};
