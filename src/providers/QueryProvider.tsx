"use client";

import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ReactNode } from "react";
import { logDevError } from "@/utils/logDevError";

const isServer = typeof window === "undefined";

function makeQueryClient() {
  const queryCache = new QueryCache({
    onError: (error) => {
      logDevError(error, error.message);
    },
  });

  return new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 60 * 1000 * 10,
        retry: false,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (isServer) {
    // 서버에서는 항상 새로운 쿼리 클라이언트를 만들어 반환
    return makeQueryClient();
  } else {
    // 브라우저에서는 이미 만들어진 쿼리 클라이언트를 반환
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface IQueryProviderProps {
  children: ReactNode;
}

export default function QueryProvider({ children }: IQueryProviderProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      {children}
    </QueryClientProvider>
  );
}
