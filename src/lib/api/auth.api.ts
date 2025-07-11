import { ISignInFormValues, ISignUpFormValues } from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
    return response.json();
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
    return response.json();
  },
};

export default authApi;
