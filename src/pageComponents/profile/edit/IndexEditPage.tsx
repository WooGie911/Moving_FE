"use client";

import { useAuth } from "@/providers/AuthProvider";
import CustomerEditPage from "./CustomerEditPage";
import MoverEditPage from "./MoverEditPage";
import MovingTruckLoader from "@/components/common/pending/MovingTruckLoader";

export default function EditPage() {
  const { user } = useAuth();

  if (user?.userType === "CUSTOMER") {
    return <CustomerEditPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverEditPage />;
  }

  return (
    <>
      <MovingTruckLoader size="lg" loadingText="데이터를 불러오는 중..." />
    </>
  );
}
