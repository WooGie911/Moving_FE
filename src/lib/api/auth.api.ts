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

    if (responseData.success) {
      setTokensToCookie(responseData.accessToken);
    }

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

    if (responseData.success) {
      setTokensToCookie(responseData.accessToken);
    }

    return responseData;
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      headers: {
        Authorization: `Bearer ${await getAccessToken()}`,
      },
      method: "POST",
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

    // 토큰 갱신 성공 시 쿠키에 저장
    if (responseData.success) {
      setTokensToCookie(responseData.accessToken);
    }

    return responseData;
  },
};

export default authApi;
