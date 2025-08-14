"use client";

import { createContext, useContext, ReactNode, useCallback, useEffect, useRef } from "react";
import { ISignUpFormValues } from "@/types/auth";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import authApi from "@/lib/api/auth.api";
import userApi from "@/lib/api/user.api";
import { logDevError } from "@/utils/logDevError";

type TUser = {
  id: string;
  name: string;
  nickname: string | null;
  userType: "CUSTOMER" | "MOVER";
  customerImage?: string;
  moverImage?: string;
  provider: "GOOGLE" | "KAKAO" | "NAVER" | "LOCAL";
  hasBothProfiles: boolean;
  // SSR에서만 세팅됨. CSR 갱신 시 없을 수 있음
  tokenExpiresAt?: number;
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

export default function AuthProvider({ children }: IAuthProviderProps) {
  const queryClient = useQueryClient();
  const refreshInFlightRef = useRef<Promise<void> | null>(null);
  const refreshTimerRef = useRef<number | null>(null);

  const {
    data: userData,
    isLoading: isUserQueryLoading,
    refetch: refetchUser,
  } = useQuery<TUser | null>({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await userApi.getUser();
        if (response?.success && response?.data) {
          return response.data as TUser;
        }
        return null;
      } catch (e) {
        logDevError(e, "Failed to get user");

        return null;
      }
    },
    // 1) on-mount 자동 실행 비활성화: SSR로만 시드, 필요 시 명시적 refetch 사용
    enabled: false,
    // 2) staleTime, gcTime 유지
    staleTime: 60 * 1000,
    gcTime: 60 * 1000 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
    // 3) 주기적 CSR 리패치 완전히 비활성화
    refetchInterval: false,
    refetchIntervalInBackground: false,
  });

  const getUser = useCallback(async () => {
    await refetchUser();
  }, [refetchUser]);

  // 중복 갱신 방지(single-flight)
  const refreshOnce = useCallback(async () => {
    if (refreshInFlightRef.current) return refreshInFlightRef.current;
    const p = (async () => {
      try {
        await authApi.refreshToken();
        await getUser();
      } finally {
        refreshInFlightRef.current = null;
      }
    })();
    refreshInFlightRef.current = p;
    return p;
  }, [getUser]);

  // 고정 주기 선제 갱신 타이머 설정 (예: 14분마다 갱신)
  // 만료 exp를 매 라운드마다 갱신하기 어렵다면, 고정 주기 리프레시로 세션을 슬라이딩 유지합니다.
  useEffect(() => {
    const FIXED_REFRESH_MS = 14 * 60 * 1000; // 서버 액세스토큰 15분 가정 시 14분에 선제 갱신
    const isLoggedIn = Boolean(userData);
    if (!isLoggedIn) return; // 로그인 상태에서만 작동

    if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    const schedule = () => {
      refreshTimerRef.current = window.setTimeout(async () => {
        await refreshOnce();
        schedule(); // 호출 후 다음 라운드 재스케줄
      }, FIXED_REFRESH_MS) as unknown as number;
    };
    schedule();

    return () => {
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    };
  }, [userData, refreshOnce]);

  const login = async (email: string, password: string, userType: TUser["userType"]) => {
    try {
      const response = await authApi.signIn({ email, password, userType });
      if (response?.error) throw new Error(response.message || "로그인에 실패했습니다.");
      // SSR로 통일: 로그인 성공 후 루트로 이동 → 레이아웃에서 SSR 프리패치로 유저 시드
      window.location.href = "/";
      return response; // 실제로는 리다이렉트로 인해 이후 코드가 실행되지 않음
    } catch (error) {
      logDevError(error, "Failed to login");
      throw error;
    }
  };

  const signUp = async (signUpData: ISignUpFormValues) => {
    try {
      const response = await authApi.signUp(signUpData);
      if (response?.error) throw new Error(response.message || "회원가입에 실패했습니다.");
      // SSR로 통일: 회원가입 성공 후 루트로 이동 → 레이아웃에서 SSR 프리패치로 유저 시드
      window.location.href = "/";
      return response; // 실제로는 리다이렉트로 인해 이후 코드가 실행되지 않음
    } catch (error) {
      logDevError(error, "Failed to sign up");
      throw error;
    }
  };

  const logout = async () => {
    try {
      const response = await authApi.logout();
      if (response?.success) {
        await queryClient.removeQueries({ queryKey: ["user"], exact: true });
        window.location.href = `/`;
      }
      return response;
    } catch (error) {
      logDevError(error, "Failed to logout");
    }
  };

  const switchUserType = async (targetType: TUser["userType"]) => {
    try {
      const response = await authApi.switchUserType(targetType);
      await getUser();
      return response;
    } catch (error) {
      logDevError(error, "Failed to switch user type");
      throw error;
    }
  };

  const socialLogin = async (type: "google" | "kakao" | "naver", userType: TUser["userType"]) => {
    try {
      // 호출 공통 로직
      await authApi[`${type}Login`](userType);
    } catch (error) {
      logDevError(error, `Failed to ${type} login`);
      throw error;
    }
  };

  const googleLogin = (userType: TUser["userType"]) => socialLogin("google", userType);
  const kakaoLogin = (userType: TUser["userType"]) => socialLogin("kakao", userType);
  const naverLogin = (userType: TUser["userType"]) => socialLogin("naver", userType);

  const contextValue: IAuthContextType = {
    user: userData ?? null,
    isLoading: isUserQueryLoading,
    isLoggedIn: !!userData,
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
