"use client";

import { useAuth } from "@/providers/AuthProvider";
import CustomerRegisterPage from "./CustomerRegisterPage";
import MoverRegisterPage from "./MoverRegisterPage";
import { useTranslations } from "next-intl";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export default function IndexRegisterPage() {
  const { user } = useAuth();
  const t = useTranslations("profile");

  if (user?.userType === "CUSTOMER") {
    return <CustomerRegisterPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverRegisterPage />;
  } else {
    return <MovingTruckLoader size="lg" loadingText={t("registerLoadingText")} />;
  }
}
