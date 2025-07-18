import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["part4-moving-s3.s3.ap-northeast-2.amazonaws.com", "s3.amazonaws.com"],
  },

  // TODO : 추후 린트 오류 모두 해결해야함
  eslint: {
    ignoreDuringBuilds: true,  // 빌드 시 ESLint 무시
  },
  typescript: {
    ignoreBuildErrors: true,   // TypeScript 오류도 무시하려면
  },
};

module.exports = nextConfig;
