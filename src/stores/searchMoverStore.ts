import { create } from "zustand";
interface SearchMoverState {
  region?: string;
  serviceTypeId?: number;
  search?: string;
  sort?: "review" | "rating" | "career" | "confirmed";
}

interface SearchMoverStore extends SearchMoverState {
  setRegion: (region?: string) => void;
  setServiceTypeId: (serviceTypeId?: number) => void;
  setSearch: (search?: string) => void;
  setSort: (sort?: "review" | "rating" | "career" | "confirmed") => void;
  reset: () => void;
}

export const useSearchMoverStore = create<SearchMoverStore>((set) => ({
  region: undefined,
  serviceTypeId: undefined,
  search: undefined,
  sort: "review",
  setRegion: (region) => set({ region }),
  setServiceTypeId: (serviceTypeId) => set({ serviceTypeId }),
  setSearch: (search) => set({ search }),
  setSort: (sort) => set({ sort }),
  reset: () => set({ region: undefined, serviceTypeId: undefined, search: undefined, sort: "review" }),
}));
