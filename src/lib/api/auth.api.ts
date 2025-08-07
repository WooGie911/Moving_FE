import { ISignInFormValues, ISignUpFormValues } from "@/types/auth";
import { apiPost } from "@/utils/apiHelpers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const authApi = {
  signIn: async (data: ISignInFormValues) => {
    const response = await apiPost(`/auth/sign-in`, data);

    return response;
  },

  signUp: async (data: ISignUpFormValues) => {
    const response = await apiPost(`/auth/sign-up`, data);

    return response;
  },

  logout: async () => {
    const response = await apiPost(`/auth/logout`, {});

    return response;
  },

  // 유저 타입 변경
  switchUserType: async (userType: "CUSTOMER" | "MOVER") => {
    const response = await apiPost(`/auth/switch-role`, { userType });

    return response;
  },

  // 리프레쉬 토큰을 사용한 토큰 갱신
  refreshToken: async () => {
    const response = await apiPost(`/auth/refresh-token`, {});

    return response;
  },

  // 구글 로그인 (페이지 리디렉션 방식)
  googleLogin: async (userType: "CUSTOMER" | "MOVER"): Promise<void> => {
    // 전체 페이지를 구글 OAuth로 리디렉션
    window.location.href = `${API_URL}/auth/google?userType=${userType}`;
  },

  // 카카오 로그인 (페이지 리디렉션 방식)
  kakaoLogin: async (userType: "CUSTOMER" | "MOVER"): Promise<void> => {
    // 전체 페이지를 카카오 OAuth로 리디렉션
    window.location.href = `${API_URL}/auth/kakao?userType=${userType}`;
  },

  // 네이버 로그인 (페이지 리디렉션 방식)
  naverLogin: async (userType: "CUSTOMER" | "MOVER"): Promise<void> => {
    // 전체 페이지를 네이버 OAuth로 리디렉션
    window.location.href = `${API_URL}/auth/naver?userType=${userType}`;
  },
};

export default authApi;
