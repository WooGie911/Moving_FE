import QueryProvider from "@/providers/QueryProvider";
import React from "react";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default Providers;
