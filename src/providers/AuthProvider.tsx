"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useRef } from "react";
import { usePathname } from "next/navigation";
import authApi from "@/lib/api/auth.api";
import userApi from "@/lib/api/user.api";
import { ISignUpFormValues } from "@/types/auth";
import { logDevError } from "@/utils/logDevError";

// 사용자 타입 정의
type TUser = {
  id: string;
  name: string;
  nickname: string | null;
  userType: "CUSTOMER" | "MOVER";
  customerImage?: string;
  moverImage?: string;
  provider: "GOOGLE" | "KAKAO" | "NAVER" | "LOCAL";
  hasBothProfiles: boolean;
};

export type TSignInResponse = {
  user: TUser;
  success: boolean;
  status?: number;
  message: string;
  accessToken: string;
};

interface ISwitchUserTypeResponse {
  success: boolean;
  message: string;
  oldUserType: "CUSTOMER" | "MOVER";
  newUserType: "CUSTOMER" | "MOVER";
  accessToken: string;
}

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
  switchUserType: (targetType: "CUSTOMER" | "MOVER") => Promise<ISwitchUserTypeResponse>;
}

const AuthContext = createContext<IAuthContextType>(undefined!);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

interface IAuthProviderProps {
  children: ReactNode;
}

const publicRoutes = ["/", "/ko", "/en", "/zh", "/userSignin", "/userSignup", "/moverSignin", "/moverSignup"];
const isPublicRoute = (path: string) => publicRoutes.includes(path);

const getMainPageByUserType = (userType: TUser["userType"]) =>
  userType === "CUSTOMER" ? "/searchMover" : "/estimate/received";

export default function AuthProvider({ children }: IAuthProviderProps) {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserFetched, setIsUserFetched] = useState(false);
  const pathname = usePathname();

  const redirectToUserMainPage = (userType: TUser["userType"]) => {
    window.location.href = getMainPageByUserType(userType);
  };

  const refreshTokenTimer = useRef<NodeJS.Timeout | null>(null);

  const startRefreshTokenTimer = (minutes: number) => {
    // 혹시 모를 중첩을 대비한 초기화 로직
    if (refreshTokenTimer.current) {
      clearInterval(refreshTokenTimer.current);
    }

    refreshTokenTimer.current = setInterval(
      async () => {
        const data = await authApi.refreshToken();
        // TODO : 테스트용으로 남겨둠
        // console.log("🔄 자동 갱신:", data);
        if (data?.error) {
          await logout();
        }
      },
      minutes * 60 * 1000,
    );
  };

  const getUser = async () => {
    try {
      const response = await userApi.getUser();

      if (response.status === 404) {
        await logout();
        return;
      }

      if (response.success && response.data) {
        setUser(response.data);

        // TODO : 테스트용으로 남겨둠
        // startRefreshTokenTimer(1);
        startRefreshTokenTimer(14);

        if (isPublicRoute(pathname)) {
          redirectToUserMainPage(response.data.userType);
        }
      } else {
        setUser(null);
      }
    } catch (e) {
      logDevError(e, "Failed to get user");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, userType: TUser["userType"]) => {
    try {
      setIsLoading(true);
      const response = await authApi.signIn({ email, password, userType });

      if (response?.error) throw new Error(response.message || "로그인에 실패했습니다.");
      await getUser();
      return response;
    } catch (error) {
      logDevError(error, "Failed to login");
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (signUpData: ISignUpFormValues) => {
    try {
      setIsLoading(true);
      const response = await authApi.signUp(signUpData);

      if (response?.error) throw new Error(response.message || "회원가입에 실패했습니다.");
      await getUser();
      return response;
    } catch (error) {
      logDevError(error, "Failed to sign up");
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      const response = await authApi.logout();

      if (response?.success) {
        window.location.href = `/`;
      }

      return response;
    } catch (error) {
      logDevError(error, "Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserType = async (targetType: TUser["userType"]) => {
    try {
      setIsLoading(true);
      const response = await authApi.switchUserType(targetType);
      await getUser();
      return response;
    } catch (error) {
      logDevError(error, "Failed to switch user type");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const socialLogin = async (type: "google" | "kakao" | "naver", userType: TUser["userType"]): Promise<void> => {
    try {
      setIsLoading(true);
      await authApi[`${type}Login`](userType);
    } catch (error) {
      logDevError(error, `Failed to ${type} login`);
      setIsLoading(false);
      throw error;
    }
  };

  const googleLogin = (userType: TUser["userType"]) => socialLogin("google", userType);
  const kakaoLogin = (userType: TUser["userType"]) => socialLogin("kakao", userType);
  const naverLogin = (userType: TUser["userType"]) => socialLogin("naver", userType);

  useEffect(() => {
    if (!isUserFetched) {
      getUser().finally(() => setIsUserFetched(true));
    }
  }, []);

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
    switchUserType,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}
