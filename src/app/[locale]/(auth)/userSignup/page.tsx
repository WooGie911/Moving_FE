import UserSignupPage from "@/pageComponents/auth/userSignup/UserSignupPage";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "일반 유저 회원가입 | Moving",
    description: "일반 유저 회원가입 페이지입니다.",
  };
}

export default function page() {
  return <UserSignupPage />;
}
