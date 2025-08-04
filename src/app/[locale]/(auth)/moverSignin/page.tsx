import MoverSigninPage from "@/pageComponents/auth/moverSignin/MoverSigninPage";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "기사님 로그인 | Moving",
    description: "기사님 로그인 페이지입니다.",
  };
}

export default function page() {
  return <MoverSigninPage />;
}
