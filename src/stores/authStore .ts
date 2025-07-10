import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  user: {
    id: string;
    email: string;
    currentRole: "USER" | "ADMIN" | "MOVER";
  } | null;
  setLogin: (token: string, user: AuthState["user"]) => void;
  setLogout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  accessToken: null,
  user: null,

  setLogin: (token, user) =>
    set(() => ({
      isLoggedIn: true,
      accessToken: token,
      user,
    })),

  setLogout: () =>
    set(() => ({
      isLoggedIn: false,
      accessToken: null,
      user: null,
    })),
}));
