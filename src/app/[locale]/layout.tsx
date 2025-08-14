import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Providers from "./providers";
import { dehydrate, QueryClient } from "@tanstack/react-query";
import { getServerUser } from "@/lib/server/getServerUser";
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
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // 현재 요청의 로케일을 서버에서 명시적으로 설정하여 클라이언트 훅(useLocale 등)과 동기화
  setRequestLocale(locale);

  // 해당 locale의 메시지 로드
  const messages = await getMessages();

  // SSR에서 유저 프리패치 → AuthProvider 위에서 하이드레이션
  const qc = new QueryClient();
  await qc.prefetchQuery({ queryKey: ["user"], queryFn: getServerUser });

  return (
    <NextIntlClientProvider key={locale} messages={messages} locale={locale}>
      <Providers reactQueryState={dehydrate(qc)}>
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
