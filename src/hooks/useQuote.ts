import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import QuoteService, { IQuoteRequest } from "@/services/quoteService";

// 견적 관련 쿼리 키
export const quoteKeys = {
  all: ["quotes"] as const,
  active: () => [...quoteKeys.all, "active"] as const,
  pending: () => [...quoteKeys.all, "pending"] as const,
  received: () => [...quoteKeys.all, "received"] as const,
  history: () => [...quoteKeys.all, "history"] as const,
};

// 활성 견적 조회
export const useActiveQuote = () => {
  return useQuery({
    queryKey: quoteKeys.active(),
    queryFn: async () => {
      const response = await QuoteService.getActiveQuote();
      if (!response.success) {
        throw new Error("활성 견적 조회에 실패했습니다.");
      }
      return response.data;
    },
    staleTime: 5 * 60 * 1000, //5분
    gcTime: 10 * 60 * 1000, //10분
  });
};

// 견적 생성
export const useCreateQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: IQuoteRequest) => {
      const response = await QuoteService.createQuote(quoteData);
      if (!response.success) {
        throw new Error("견적 생성에 실패했습니다.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.active() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.pending() });
    },
  });
};

// 활성 견적 수정
export const useUpdateActiveQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteData: Partial<IQuoteRequest>) => {
      const response = await QuoteService.updateActiveQuote(quoteData);
      if (!response.success) {
        throw new Error("견적 수정에 실패했습니다.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.active() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.pending() });
    },
  });
};

// 견적 삭제 (취소)
export const useDeleteQuote = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await QuoteService.deleteQuote();
      if (!response.success) {
        throw new Error("견적 삭제에 실패했습니다.");
      }
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: quoteKeys.active() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.pending() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.received() });
      queryClient.invalidateQueries({ queryKey: quoteKeys.history() });
    },
  });
};
