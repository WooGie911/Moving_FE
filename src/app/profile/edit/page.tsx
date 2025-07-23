"use client";

import CustomerEditPage from "@/pageComponents/profile/edit/CustomerEditPage";
import MoverEditPage from "@/pageComponents/profile/edit/MoverEditPage";
import { useAuth } from "@/providers/AuthProvider";

export default function EditPage() {
  const { user } = useAuth();

  if (user?.userType === "CUSTOMER") {
    return <CustomerEditPage />;
  } else if (user?.userType === "MOVER") {
    return <MoverEditPage />;
  }
}
