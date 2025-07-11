import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: {
    id: string;
    userName: string;
    userRole: "CUSTOMER" | "MOVER";
  } | null;
  setLogin: (user: AuthState["user"]) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,

  setLogin: (user) =>
    set(() => ({
      isLoggedIn: true,
      user,
    })),

  setLogout: () =>
    set(() => ({
      isLoggedIn: false,
      user: null,
    })),
}));
