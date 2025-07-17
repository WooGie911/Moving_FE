// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "s3.amazonaws.com",
      // 필요하다면 다른 외부 도메인도 추가
    ],
  },
  // ...기존 설정 유지
};

module.exports = nextConfig;
