import UserSignupPage from "@/pageComponents/auth/userSignup/UserSignupPage";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";

// ISR: 5분마다 재생성
export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return {
    title: t("userSignupMetadata.title"),
    description: t("userSignupMetadata.description"),
  };
}

export default function page() {
  return <UserSignupPage />;
}
