import { useAuthStore } from "@/stores/authStore ";

type User = {
  id: string;
  email: string;
  currentRole: "USER" | "ADMIN" | "MOVER";
};

export const useAuth = () => {
  const { isLoggedIn, user, accessToken, setLogin, setLogout } = useAuthStore();

  const login = (token: string, user: User) => {
    setLogin(token, user);
  };

  const logout = () => {
    setLogout();
  };

  return { isLoggedIn, user, accessToken, login, logout };
};
