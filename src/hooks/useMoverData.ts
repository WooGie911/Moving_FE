import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverListParams } from "@/types/mover.types";
import { useLocale } from "next-intl";

// 기사님 리스트 조회 (무한 스크롤)
export const useMoverList = (params: IMoverListParams) => {
  const locale = useLocale();

  return useInfiniteQuery({
    queryKey: ["movers", params, locale],
    queryFn: ({ pageParam }) => findMoverApi.fetchMovers({ ...params, cursor: pageParam }, locale),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
    placeholderData: (previousData) => previousData,
  });
};

// 기사님 상세 조회
export const useMoverDetail = (moverId: string) => {
  const locale = useLocale();

  return useQuery({
    queryKey: ["mover", moverId, locale],
    queryFn: () => findMoverApi.fetchMoverDetail(moverId, locale),
    enabled: !!moverId,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });
};

// 찜한 기사님 조회 (3개만)
export const useFavoriteMovers = () => {
  const locale = useLocale();

  return useQuery({
    queryKey: ["favoriteMovers", "preview", locale],
    queryFn: () => findMoverApi.fetchFavoriteMovers(3, undefined, locale),
    // 캐싱 비활성화: 찜하기는 실시간 반영 필요
    staleTime: 0,
    gcTime: 0,
    select: (data) => data.items, // items만 반환
  });
};

// 무한스크롤 찜한 기사님 조회
export const useInfiniteFavoriteMovers = (limit: number = 3, language?: string) => {
  return useInfiniteQuery({
    queryKey: ["favoriteMovers", limit, language],
    queryFn: ({ pageParam }) => findMoverApi.fetchFavoriteMovers(limit, pageParam, language),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    // 캐싱 비활성화
    staleTime: 0,
    gcTime: 0,
  });
};

// 지역 목록 조회
export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => findMoverApi.fetchRegions(),
    staleTime: 60 * 60 * 1000, // 1시간 (정적 데이터)
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  });
};

// 서비스 타입 목록 조회
export const useServiceTypes = () => {
  return useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => findMoverApi.fetchServiceTypes(),
    staleTime: 60 * 60 * 1000, // 1시간 (정적 데이터)
    gcTime: 24 * 60 * 60 * 1000, // 24시간
  });
};

// 찜하기 추가
export const useAddFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moverId: string) => findMoverApi.addFavorite(moverId),
    onSuccess: (data, moverId) => {
      queryClient.setQueriesData({ queryKey: ["movers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((mover: any) =>
              mover.id === moverId
                ? {
                    ...mover,
                    favoriteCount: (mover.favoriteCount || 0) + 1,
                    isFavorited: true,
                  }
                : mover,
            ),
          })),
        };
      });

      // 개별 기사님 상세 정보도 업데이트
      queryClient.setQueriesData({ queryKey: ["mover", moverId] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          favoriteCount: (oldData.favoriteCount || 0) + 1,
          isFavorited: true,
        };
      });

      // 찜한 기사님 목록에도 추가
      queryClient.setQueriesData({ queryKey: ["favoriteMovers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        const firstPage = oldData.pages[0];
        if (firstPage?.items) {
          const moverData = queryClient.getQueryData(["mover", moverId]);
          if (moverData) {
            const newFirstPage = {
              ...firstPage,
              items: [moverData, ...firstPage.items],
            };

            return {
              ...oldData,
              pages: [newFirstPage, ...oldData.pages.slice(1)],
            };
          }
        }
        return oldData;
      });
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["movers"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });
    },
  });
};

// 찜하기 제거
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moverId: string) => findMoverApi.removeFavorite(moverId),
    onSuccess: (data, moverId) => {
      // 낙관적 업데이트: 즉시 UI 반영
      queryClient.setQueriesData({ queryKey: ["movers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((mover: any) =>
              mover.id === moverId
                ? {
                    ...mover,
                    favoriteCount: Math.max(0, (mover.favoriteCount || 0) - 1),
                    isFavorited: false,
                  }
                : mover,
            ),
          })),
        };
      });

      // 개별 기사님 상세 정보도 업데이트
      queryClient.setQueriesData({ queryKey: ["mover", moverId] }, (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          favoriteCount: Math.max(0, (oldData.favoriteCount || 0) - 1),
          isFavorited: false,
        };
      });

      // 찜한 기사님 목록에서 제거
      queryClient.setQueriesData({ queryKey: ["favoriteMovers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.filter((mover: any) => mover.id !== moverId),
          })),
        };
      });

      // 백그라운드에서 캐시 무효화 (데이터 동기화)
      queryClient.invalidateQueries({ queryKey: ["pendingEstimateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["receivedEstimateRequests"] });
      queryClient.invalidateQueries({ queryKey: ["movers"] });
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });
    },
  });
};
