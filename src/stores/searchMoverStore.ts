import { create } from "zustand";
import { IMoverListParams } from "@/types/findMover";

// 컴포넌트 간 props drilling 없이 region, serviceTypeId, search, sort 등 검색 조건을 공유할 수 있음

interface SearchMoverState extends IMoverListParams {
  reset: () => void;
  setRegion: (region: string) => void;
  setServiceTypeId: (serviceTypeId: number) => void;
  setSearch: (search: string) => void;
  setSort: (sort: "review" | "rating" | "career" | "confirmed" | undefined) => void;
}

const initialState: IMoverListParams = {
  region: undefined,
  serviceTypeId: undefined,
  search: "",
  sort: undefined,
  cursor: undefined,
  take: undefined,
};

export const useSearchMoverStore = create<SearchMoverState>((set) => ({
  ...initialState,
  reset: () => set(initialState),
  setRegion: (region) => set({ region }),
  setServiceTypeId: (serviceTypeId) => set({ serviceTypeId }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
}));
