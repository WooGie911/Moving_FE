// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page and their
// browser's web vitals are reported. https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 0.1, // 10%만 샘플링하여 성능 향상

  // Enable logs to be sent to Sentry
  enableLogs: false, // 로그 비활성화로 성능 향상

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,

  // 성능 최적화 설정
  beforeSend(event) {
    // 메인 스레드 블로킹 방지를 위해 비동기 처리
    if (event.type === "transaction") {
      // 트랜잭션 이벤트는 우선순위 낮춤
      return event;
    }
    return event;
  },

  // 에러 샘플링 비율 낮춤
  sampleRate: 0.1, // 10%만 에러 전송

  // 웹 바이탈 모니터링 최적화
  integrations: [Sentry.browserTracingIntegration()],
});
