import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import findMoverApi from "@/lib/api/findMover.api";
import { IMoverListParams } from "@/types/mover.types";

// 기사님 리스트 조회 (무한 스크롤)
export const useMoverList = (params: IMoverListParams) => {
  return useInfiniteQuery({
    queryKey: ["movers", params],
    queryFn: ({ pageParam }) => findMoverApi.fetchMovers({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: undefined as string | undefined,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 기사님 상세 조회
export const useMoverDetail = (moverId: string) => {
  return useQuery({
    queryKey: ["mover", moverId],
    queryFn: () => findMoverApi.fetchMoverDetail(moverId),
    enabled: !!moverId,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000, 
  });
};

// 찜한 기사님 조회
export const useFavoriteMovers = () => {
  return useQuery({
    queryKey: ["favoriteMovers"],
    queryFn: () => findMoverApi.fetchFavoriteMovers(),
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000, 
  });
};

// 지역 목록 조회
export const useRegions = () => {
  return useQuery({
    queryKey: ["regions"],
    queryFn: () => findMoverApi.fetchRegions(),
    staleTime: 60 * 60 * 1000, 
    gcTime: 24 * 60 * 60 * 1000, 
  });
};

// 서비스 타입 목록 조회
export const useServiceTypes = () => {
  return useQuery({
    queryKey: ["serviceTypes"],
    queryFn: () => findMoverApi.fetchServiceTypes(),
    staleTime: 60 * 60 * 1000, 
    gcTime: 24 * 60 * 60 * 1000, 
  });
};
