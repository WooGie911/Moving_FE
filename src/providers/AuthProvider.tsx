"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import authApi from "@/lib/api/auth.api";
import userApi from "@/lib/api/user.api";
import { ISignUpFormValues } from "@/types/auth";

// 사용자 타입 정의 - API 응답에 맞게 수정
type TUser = {
  id: string;
  name: string;
  nickname: string | null;
  userType: "CUSTOMER" | "MOVER";
  customerImage?: string;
};

export type TSignInResponse = {
  user: {
    id: string;
    name: string;
    nickname: string | null;
    userType: "CUSTOMER" | "MOVER";
  };
  success: boolean;
  status?: number;
  message: string;
  accessToken: string;
};

interface IAuthContextType {
  user: TUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  login: (email: string, password: string, userType: "CUSTOMER" | "MOVER") => Promise<TSignInResponse>;
  signUp: (signUpData: ISignUpFormValues) => Promise<TSignInResponse>;
  googleLogin: (userType: "CUSTOMER" | "MOVER") => Promise<void>;
  kakaoLogin: (userType: "CUSTOMER" | "MOVER") => Promise<void>;
  naverLogin: (userType: "CUSTOMER" | "MOVER") => Promise<void>;
  logout: () => void;
  getUser: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextType>({
  user: null,
  isLoading: true,
  isLoggedIn: false,
  login: async () => ({
    user: { id: "", name: "", nickname: null, userType: "CUSTOMER" },
    success: false,
    message: "AuthProvider not found",
    accessToken: "",
  }),
  signUp: async () => ({
    user: { id: "", name: "", nickname: null, userType: "CUSTOMER" },
    success: false,
    message: "AuthProvider not found",
    accessToken: "",
  }),
  googleLogin: async () => {},
  kakaoLogin: async () => {},
  naverLogin: async () => {},
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

  // 리다이렉트 로직을 별도 함수로 분리
  const handleRedirectAfterAuth = (user: { nickname?: string | null; userType?: string }) => {
    let targetPath = "";

    if (!user?.nickname) {
      targetPath = "/profile/register";
    } else if (user?.userType === "CUSTOMER") {
      targetPath = "/searchMover";
    } else if (user?.userType === "MOVER") {
      targetPath = "/estimate/received";
    }

    // 현재 경로와 다른 경우에만 리다이렉트
    if (targetPath && pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  /**
   * 서버에서 현재 사용자 정보 조회
   */
  const getUser = async () => {
    try {
      const response = await userApi.getUser();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("사용자 정보 조회 실패:", e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 로그인 함수
   */
  const login = async (email: string, password: string, userType: "CUSTOMER" | "MOVER") => {
    try {
      setIsLoading(true);
      const response = await authApi.signIn({ email, password, userType });

      if (response?.error) {
        throw new Error(response.message || "로그인에 실패했습니다.");
      }

      // 로그인 성공 후 사용자 정보 조회
      await getUser();

      // 현재 경로를 고려한 리다이렉트
      handleRedirectAfterAuth(response.user);

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
   * 회원가입 함수
   */
  const signUp = async (signUpData: ISignUpFormValues) => {
    try {
      setIsLoading(true);
      const response = await authApi.signUp(signUpData);

      if (response?.error) {
        throw new Error(response.message || "회원가입에 실패했습니다.");
      }

      // 회원가입 성공 후 사용자 정보 조회
      await getUser();

      // 현재 경로를 고려한 리다이렉트
      handleRedirectAfterAuth(response.user);

      return response;
    } catch (error) {
      console.error("회원가입 실패:", error);
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
   * 구글 로그인 함수
   */
  const googleLogin = async (userType: "CUSTOMER" | "MOVER") => {
    try {
      setIsLoading(true);
      // 페이지 리디렉션 방식으로 변경 (Promise<void> 반환)
      await authApi.googleLogin(userType);
      // 리디렉션이 발생하므로 이후 코드는 실행되지 않음
    } catch (error: unknown) {
      console.error("구글 로그인 실패:", error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * 카카오 로그인 함수
   */
  const kakaoLogin = async (userType: "CUSTOMER" | "MOVER") => {
    try {
      setIsLoading(true);
      // 페이지 리디렉션 방식으로 변경 (Promise<void> 반환)
      await authApi.kakaoLogin(userType);
      // 리디렉션이 발생하므로 이후 코드는 실행되지 않음
    } catch (error: unknown) {
      console.error("카카오 로그인 실패:", error);
      setIsLoading(false);
      throw error;
    }
  };

  /**
   * 네이버 로그인 함수
   */
  const naverLogin = async (userType: "CUSTOMER" | "MOVER") => {
    try {
      setIsLoading(true);
      await authApi.naverLogin(userType);
    } catch (error: unknown) {
      console.error("네이버 로그인 실패:", error);
      setIsLoading(false);
      throw error;
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
    signUp,
    googleLogin,
    kakaoLogin,
    naverLogin,
    logout,
    getUser,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
