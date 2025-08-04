import UserSigninPage from "@/pageComponents/auth/userSignin/UserSigninPage";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "일반 유저 로그인 | Moving",
    description: "일반 유저 로그인 페이지입니다.",
  };
}

export default function page() {
  return <UserSigninPage />;
}
