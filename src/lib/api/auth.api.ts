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

    if (responseData.status === 200) {
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

    if (responseData.status === 200) {
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
};

export default authApi;
