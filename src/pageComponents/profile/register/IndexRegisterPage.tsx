"use client";

import { useAuth } from "@/providers/AuthProvider";
import CustomerRegisterPage from "./CustomerRegisterPage";
import MoverRegisterPage from "./MoverRegisterPage";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useTranslations } from "next-intl";

export default function IndexRegisterPage() {
  const { user } = useAuth();
  const t = useTranslations("profile");

  if (user?.userType === "CUSTOMER" && !user?.nickname) {
    return <CustomerRegisterPage />;
  } else if (user?.userType === "MOVER" && !user?.nickname) {
    return <MoverRegisterPage />;
  } else {
    return <MovingTruckLoader size="lg" loadingText="등록페이지 불러오는 중..." />;
  }
}
