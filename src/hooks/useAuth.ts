import authApi from "@/lib/api/auth.api";
import { useAuthStore } from "@/stores/authStore ";

export const useAuth = () => {
  const { isLoggedIn, user, setLogin, setLogout } = useAuthStore();

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.signIn({
        email,
        password,
      });

      setLogin(response.user);

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  const logout = () => {
    setLogout();
  };

  return { isLoggedIn, user, login, logout };
};
