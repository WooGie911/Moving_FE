import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["part4-moving-s3.s3.ap-northeast-2.amazonaws.com", "s3.amazonaws.com"],
  },
};

module.exports = nextConfig;
