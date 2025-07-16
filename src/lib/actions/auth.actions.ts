"use server";

import { ISignInFormValues, ISignUpFormValues } from "@/types/auth";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signInAction = async (data: ISignInFormValues) => {
  const cookieStore = await cookies();

  const response = await fetch(`${API_URL}/auth/sign-in`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseData = await response.json();

  // 서버에서 받은 토큰들을 쿠키에 저장
  if (responseData.accessToken) {
    cookieStore.set("accessToken", responseData.accessToken, {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 15, // 15분
    });
  }

  return responseData;
};

export const signUpAction = async (data: ISignUpFormValues) => {
  const cookieStore = await cookies();

  const response = await fetch(`${API_URL}/auth/sign-up`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });

  const responseData = await response.json();

  // 서버에서 받은 토큰들을 쿠키에 저장
  if (responseData.accessToken) {
    cookieStore.set("accessToken", responseData.accessToken, {
      path: "/",
      httpOnly: false,
      secure: true,
      sameSite: "none",
      maxAge: 60 * 15, // 15분
    });
  }

  return responseData;
};

export const logoutAction = async (accessToken: string) => {
  const cookieStore = await cookies();

  try {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseData = await response.json();

    // 쿠키 삭제
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");

    return responseData;
  } catch (error) {
    console.error("로그아웃 실패:", error);
    // 오류가 발생해도 쿠키는 삭제
    cookieStore.delete("accessToken");
    cookieStore.delete("refreshToken");
    throw error;
  }
};
