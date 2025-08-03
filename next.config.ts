import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["part4-moving-s3.s3.ap-northeast-2.amazonaws.com", "s3.amazonaws.com", "example.com"],
    formats: ["image/webp", "image/avif"],
    deviceSizes: [375, 744, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30일 캐시
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // TODO : 추후 린트 오류 모두 해결해야함
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true, // TypeScript 오류도 무시하려면
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
