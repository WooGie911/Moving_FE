import { withSentryConfig } from "@sentry/nextjs";
import { NextConfig } from "next";
import createBundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";

const withBundleAnalyzer = createBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // TODO : 충돌 테스트
      // {
      //   protocol: "https",
      //   hostname: "part4-moving-s3.s3.ap-northeast-2.amazonaws.com",
      //   pathname: "/**",
      // },
      {
        protocol: "https",
        hostname: "d29ije7v1csha8.cloudfront.net",
        pathname: "/**",
      },
      // {
      //   protocol: "https",
      //   hostname: "s3.amazonaws.com",
      // },
      // {
      //   protocol: "https",
      //   hostname: "example.com",
      // },
    ],
    // domains: ["part4-moving-s3.s3.ap-northeast-2.amazonaws.com", "s3.amazonaws.com", "example.com"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [375, 744, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

// ⚠️ Plugin wrapping 순서 중요
const wrappedConfig = withBundleAnalyzer(withNextIntl(nextConfig));

export default withSentryConfig(wrappedConfig, {
  org: "moving-1m",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
