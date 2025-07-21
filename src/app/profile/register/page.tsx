"use client";

import CustomerRegisterPage from "@/pageComponents/profile/register/CustomerRegisterPage";
import MoverRegisterPage from "@/pageComponents/profile/register/MoverRegisterPage";
import { useAuth } from "@/providers/AuthProvider";
import React from "react";

// 분기 처리?
export default function Page() {
  const { user } = useAuth();

  if (user?.currentRole === "CUSTOMER") {
    return <CustomerRegisterPage />;
  } else if (user?.currentRole === "MOVER") {
    return <MoverRegisterPage />;
  }
}
