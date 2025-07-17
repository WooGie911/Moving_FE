"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import authApi from "@/lib/api/auth.api";
import userApi from "@/lib/api/user.api";

// 사용자 타입 정의
type TUser = {
  id: string;
  name: string;
  currentRole: "CUSTOMER" | "MOVER";
  hasProfile: boolean;
  accessToken?: string;
};

type TSignInResponse = {
  status: number;
  user?: {
    id: string;
    userName: string;
    userRole: string;
  };
  message: string;
};

interface IAuthContextType {
  user: TUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<TSignInResponse>;
  logout: () => void;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => ({ status: 0, message: "AuthProvider not found" }),
  logout: () => {},
  getUser: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface IAuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  /**
   * 서버에서 현재 사용자 정보 조회
   */
  const getUser = async () => {
    let userData = null;
    try {
      const response = await userApi.getUser();
      if (response.success) {
        userData = response.data;
      }
    } catch (e) {
      // 비회원은 userData = null
      userData = null;
    }
    setUser(userData);
  };

  /**
   * 로그인 함수
   */
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await authApi.signIn({ email, password });

      if (response?.error) {
        throw new Error(response.message || "로그인에 실패했습니다.");
      }

      // 로그인 성공 후 사용자 정보 조회
      await getUser();

      if (response.user?.userRole === "CUSTOMER") {
        router.push("/searchMover");
      } else if (response.user?.userRole === "MOVER") {
        router.push("/estimate/received");
      }

      return response;
    } catch (error) {
      console.error("로그인 실패:", error);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그아웃 함수
   */
  const logout = async () => {
    try {
      setUser(null);

      await authApi.logout();
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 새로고침 시 인증 상태 확인
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // 인증이 필요하지 않은 페이지들
      const publicRoutes = ["/", "/userSignin", "/userSignup", "/moverSignin", "/moverSignup"];

      if (!pathname || publicRoutes.includes(pathname)) {
        setIsLoading(false);
        return;
      }

      // 인증된 페이지에서는 사용자 정보 조회
      await getUser();
    };

    initializeAuth();
  }, [pathname]);

  const contextValue: IAuthContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
    login,
    logout,
    getUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
