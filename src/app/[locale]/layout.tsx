import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Providers from "./providers";
import { Gnb } from "@/components/common/gnb/Gnb";
import { ToastContainer } from "react-toastify";
import { LanguageInitializer } from "@/components/common/LanguageInitializer";
import "react-toastify/dist/ReactToastify.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // 유효한 locale인지 확인
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // 해당 locale의 메시지 로드
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Providers>
        <LanguageInitializer>
          <Gnb />
          {children}
          <ToastContainer
            position="top-center"
            autoClose={2000}
            hideProgressBar
            pauseOnHover={false}
            draggable={false}
            closeOnClick
            theme="light"
            toastClassName="custom-toast"
          />
        </LanguageInitializer>
      </Providers>
    </NextIntlClientProvider>
  );
}
