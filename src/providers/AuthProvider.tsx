"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname } from "next/navigation";
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

interface IAuthContextType {
  user: TUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<{ user?: TUser; error?: string; message?: string }>;
  logout: () => void;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => ({ error: "AuthProvider not found" }),
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

  /**
   * 서버에서 현재 사용자 정보 조회
   */
  const getUser = async () => {
    try {
      setIsLoading(true);
      const response = await userApi.getUser();

      if (!response.success) {
        throw new Error("사용자 정보 조회 실패");
      }

      setUser(response.data);
    } catch (error) {
      console.error("사용자 정보 조회 실패:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
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
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  /**
   * 앱 초기화시 인증 상태 확인
   */
  useEffect(() => {
    const initializeAuth = async () => {
      // 인증이 필요하지 않은 페이지들
      const publicRoutes = ["/", "/userSignin", "/userSignup", "/moverSignin", "/moverSignup"];

      if (!pathname || publicRoutes.includes(pathname)) {
        setIsLoading(false);
        return;
      }

      // 보호된 페이지에서는 사용자 정보 조회
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
