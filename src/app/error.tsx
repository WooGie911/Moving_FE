"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import NotFoundImage from "@/assets/img/etc/notfound.webp";
import { logDevError } from "@/utils/logDevError";
import * as Sentry from "@sentry/nextjs";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // 에러를 에러 리포팅 서비스에 로그
    logDevError(error, "Error");

    // ✅ Sentry로 전송
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4" role="main">
      {/* 에러 이미지 */}
      <figure className="relative mb-8 h-80 w-80">
        <Image src={NotFoundImage} alt="error" fill className="h-64 w-64 object-contain md:h-80 md:w-80" priority />
      </figure>

      {/* 에러 메시지 */}
      <section className="text-center">
        <header>
          <h1 className="mb-6 text-3xl font-extrabold text-red-600 drop-shadow-lg md:text-4xl lg:text-5xl">
            Oops! Something went wrong
          </h1>
        </header>

        <article className="mb-8">
          <p className="mb-2 text-base text-gray-600 md:text-lg">
            An unexpected error occurred while loading the page.
          </p>
          <p className="text-sm text-gray-500 md:text-base">
            Please try again later, or contact our support if the problem persists.
          </p>
        </article>

        {/* 액션 버튼들 */}
        <nav
          className="flex flex-col gap-4 sm:flex-row sm:justify-center"
          role="navigation"
          aria-label="에러 페이지 액션"
        >
          <button
            onClick={() => reset()}
            className="bg-primary-400 hover:bg-primary-500 focus:ring-primary-400 rounded-lg px-6 py-3 text-white transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none"
            type="button"
            aria-label="페이지 다시 로드"
          >
            again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 transition-colors hover:bg-gray-50 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:outline-none"
            type="button"
            aria-label="홈페이지로 이동"
          >
            home
          </button>
        </nav>
      </section>
    </main>
  );
}
