"use client";

import { useAuth } from "@/providers/AuthProvider";
import CustomerEditPage from "./CustomerEditPage";
import MoverEditPage from "./MoverEditPage";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";
import { useTranslations } from "next-intl";

export default function EditPage() {
  const { user } = useAuth();
  const t = useTranslations("profile");

  if (user?.userType === "CUSTOMER") {
    return <CustomerEditPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverEditPage />;
  } else {
    return <MovingTruckLoader size="lg" loadingText={t("editLoadingText")} />;
  }
}
