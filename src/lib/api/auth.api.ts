import { ISignInFormValues, ISignUpFormValues } from "@/types/auth";
import { logoutAction, signInAction, signUpAction } from "../actions/auth.actions";

const authApi = {
  signIn: async (data: ISignInFormValues) => {
    const response = await signInAction(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  },

  signUp: async (data: ISignUpFormValues) => {
    const response = await signUpAction(data);
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", response.accessToken);
    }

    return response;
  },

  logout: async () => {
    if (typeof window !== "undefined") {
      const accessToken = localStorage.getItem("accessToken") || "";
      await logoutAction(accessToken);
      localStorage.removeItem("accessToken");
    }
  },
};

export default authApi;
