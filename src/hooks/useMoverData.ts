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
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
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
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
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
      // 찜한 기사님 목록 캐시 무효화 (preview와 infinite 모두)
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });

      // 기사님 리스트 캐시 무효화 (더 강력한 무효화)
      queryClient.invalidateQueries({ queryKey: ["movers"] });

      // 기사님 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["mover", moverId] });

      // 즉시 캐시 업데이트 (백업)
      queryClient.setQueriesData({ queryKey: ["movers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((mover: any) =>
              mover.id === moverId
                ? { ...mover, favoriteCount: data.favoriteCount, isFavorited: data.isFavorited }
                : mover,
            ),
          })),
        };
      });

      queryClient.setQueriesData({ queryKey: ["mover", moverId] }, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, favoriteCount: data.favoriteCount, isFavorited: data.isFavorited };
      });
    },
  });
};

// 찜하기 제거
export const useRemoveFavorite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moverId: string) => findMoverApi.removeFavorite(moverId),
    onSuccess: (data, moverId) => {
      // 찜한 기사님 목록 캐시 무효화 (preview와 infinite 모두)
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });

      // 기사님 리스트 캐시 무효화 (더 강력한 무효화)
      queryClient.invalidateQueries({ queryKey: ["movers"] });

      // 기사님 상세 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["mover", moverId] });

      // 즉시 캐시 업데이트 (백업)
      queryClient.setQueriesData({ queryKey: ["movers"] }, (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((mover: any) =>
              mover.id === moverId
                ? { ...mover, favoriteCount: data.favoriteCount, isFavorited: data.isFavorited }
                : mover,
            ),
          })),
        };
      });

      queryClient.setQueriesData({ queryKey: ["mover", moverId] }, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, favoriteCount: data.favoriteCount, isFavorited: data.isFavorited };
      });

      // 즐겨찾기 무한 목록에서도 즉시 제거 (옵티미스틱 후속 보장)
      queryClient.setQueriesData({ queryKey: ["favoriteMovers"] }, (oldData: any) => {
        // infiniteQuery 형태 처리
        if (oldData?.pages) {
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => ({
              ...page,
              items: (page.items || []).filter((mover: any) => mover.id !== moverId),
            })),
          };
        }

        // 일반 query에서 select로 items 배열만 보관하는 경우 (preview 리스트)
        if (Array.isArray(oldData)) {
          return oldData.filter((mover: any) => mover.id !== moverId);
        }

        // 일반 query 원형을 보관하는 경우
        if (oldData?.items) {
          return {
            ...oldData,
            items: (oldData.items || []).filter((mover: any) => mover.id !== moverId),
          };
        }

        return oldData;
      });
    },
  });
};
