import QueryProvider from "@/providers/QueryProvider";
import AuthProvider from "@/providers/AuthProvider";
import { ModalProvider } from "@/components/common/modal/ModalContext";
import NotificationSSEProvider from "@/providers/NotificationSSEProvider";
import { HydrationBoundary, type DehydratedState } from "@tanstack/react-query";

interface IProvidersProps {
  children: React.ReactNode;
  reactQueryState?: DehydratedState;
}

const Providers = ({ children, reactQueryState }: IProvidersProps) => {
  return (
    <QueryProvider>
      <HydrationBoundary state={reactQueryState}>
        <AuthProvider>
          <ModalProvider>
            <NotificationSSEProvider>{children}</NotificationSSEProvider>
          </ModalProvider>
        </AuthProvider>
      </HydrationBoundary>
    </QueryProvider>
  );
};

export default Providers;
