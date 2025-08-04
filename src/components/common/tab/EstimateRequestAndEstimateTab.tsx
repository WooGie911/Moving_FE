import { Tab } from "@/components/common/tab/Tab";
import React from "react";
import { useTranslations } from "next-intl";

// 하드코딩된 탭들을 제거하고 컴포넌트 내부에서 다국어 처리

interface IUserType {
  userType: "User" | "Mover" | "Detail" | "MoverReceived";
}

export const EstimateRequestAndEstimateTab = ({ userType }: IUserType) => {
  const t = useTranslations("tabs");

  const getTabList = () => {
    switch (userType) {
      case "User":
        return [
          { name: t("pendingQuote"), href: "/estimateRequest/pending" },
          { name: t("receivedQuote"), href: "/estimateRequest/received" },
        ];
      case "Mover":
        return [
          { name: t("sentQuote"), href: "/estimate/request" },
          { name: t("rejectedRequest"), href: "/estimate/rejected" },
        ];
      case "Detail":
        return [{ name: t("quoteDetail"), href: "" }];
      case "MoverReceived":
        return [{ name: t("receivedRequest"), href: "/estimate/received" }];
      default:
        return [
          { name: t("pendingQuote"), href: "/estimateRequest/pending" },
          { name: t("receivedQuote"), href: "/estimateRequest/received" },
        ];
    }
  };

  // Detail 케이스일 때 CSS 추가
  const detailClassName = userType === "Detail" ? "[&_a]:text-black-400" : "";

  return <Tab tabList={getTabList()} className={detailClassName} />;
};
