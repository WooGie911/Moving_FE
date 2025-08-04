"use client";

import { useAuth } from "@/providers/AuthProvider";
import CustomerEditPage from "./CustomerEditPage";
import MoverEditPage from "./MoverEditPage";

export default function EditPage() {
  const { user } = useAuth();

  if (user?.userType === "CUSTOMER") {
    return <CustomerEditPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverEditPage />;
  }
}
