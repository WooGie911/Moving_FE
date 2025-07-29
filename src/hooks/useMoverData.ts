import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverListParams } from "@/types/mover.types";

// 기사님 리스트 조회 (무한 스크롤)
export const useMoverList = (params: IMoverListParams) => {
  return useInfiniteQuery({
    queryKey: ["movers", params],
    queryFn: ({ pageParam }) => findMoverApi.fetchMovers({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000, // 10분
  });
};

// 기사님 상세 조회
export const useMoverDetail = (moverId: string) => {
  return useQuery({
    queryKey: ["mover", moverId],
    queryFn: () => findMoverApi.fetchMoverDetail(moverId),
    enabled: !!moverId,
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 30 * 60 * 1000, // 30분
  });
};

// 찜한 기사님 조회
export const useFavoriteMovers = () => {
  return useQuery({
    queryKey: ["favoriteMovers"],
    queryFn: () => findMoverApi.fetchFavoriteMovers(),
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000, // 5분
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
      // 찜한 기사님 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });

      // 기사님 리스트 캐시 업데이트
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

      // 기사님 상세 캐시 업데이트
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
      // 찜한 기사님 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ["favoriteMovers"] });

      // 기사님 리스트 캐시 업데이트
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

      // 기사님 상세 캐시 업데이트
      queryClient.setQueriesData({ queryKey: ["mover", moverId] }, (oldData: any) => {
        if (!oldData) return oldData;
        return { ...oldData, favoriteCount: data.favoriteCount, isFavorited: data.isFavorited };
      });
    },
  });
};
