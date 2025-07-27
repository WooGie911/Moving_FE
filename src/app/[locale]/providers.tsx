import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ModalProvider } from "@/components/common/modal/ModalContext";
import NotificationSSEProvider from "@/providers/NotificationSSEProvider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryProvider>
      <AuthProvider>
        <ModalProvider>
          <NotificationSSEProvider>{children}</NotificationSSEProvider>
        </ModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default Providers;
