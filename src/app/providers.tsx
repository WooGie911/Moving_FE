import { ModalProvider } from "@/components/common/modal/ModalContext";
import QueryProvider from "@/providers/QueryProvider";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <ModalProvider>{children}</ModalProvider>
    </QueryProvider>
  );
};

export default Providers;
