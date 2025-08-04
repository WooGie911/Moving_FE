"use client";

import CustomerRegisterPage from "@/pageComponents/profile/register/CustomerRegisterPage";
import MoverRegisterPage from "@/pageComponents/profile/register/MoverRegisterPage";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";

export default function Page() {
  const { user } = useAuth();

  if (user?.userType === "CUSTOMER" && !user?.nickname) {
    return <CustomerRegisterPage />;
  } else if (user?.userType === "MOVER" && !user?.nickname) {
    return <MoverRegisterPage />;
  }

  // nickname이 있는 경우 기본 페이지 렌더링
  if (user?.userType === "CUSTOMER") {
    return <CustomerRegisterPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverRegisterPage />;
  }

  return null; // 로딩 상태 또는 인증되지 않은 상태
}
