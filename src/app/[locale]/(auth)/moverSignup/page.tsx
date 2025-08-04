import MoverSignupPage from "@/pageComponents/auth/moverSignup/MoverSignupPage";
import React from "react";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "기사님 회원가입 | Moving",
    description: "기사님 회원가입 페이지입니다.",
  };
}

export default function page() {
  return <MoverSignupPage />;
}
