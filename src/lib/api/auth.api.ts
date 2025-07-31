import { ISignInFormValues, ISignUpFormValues } from "@/types/auth";
import { getTokenFromCookie, setTokensToCookie } from "@/utils/auth";
import { clearServerSideTokens } from "../actions/auth.actions";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAccessToken = async () => {
  const accessToken = await getTokenFromCookie();
  return accessToken;
};

const authApi = {
  signIn: async (data: ISignInFormValues) => {
    const response = await fetch(`${API_URL}/auth/sign-in`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    return responseData;
  },

  signUp: async (data: ISignUpFormValues) => {
    const response = await fetch(`${API_URL}/auth/sign-up`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
    });

    const responseData = await response.json();

    return responseData;
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      method: "POST",
      credentials: "include",
    });

    const responseData = await response.json();

    await clearServerSideTokens();

    return responseData;
  },

  // 리프레쉬 토큰을 사용한 토큰 갱신
  refreshToken: async () => {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
    });

    const responseData = await response.json();

    return responseData;
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
