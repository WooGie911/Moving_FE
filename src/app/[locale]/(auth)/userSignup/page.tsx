import UserSignupPage from "@/pageComponents/auth/userSignup/UserSignupPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("auth.userSignupMetadata");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function page() {
  return <UserSignupPage />;
}
