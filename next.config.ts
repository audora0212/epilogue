import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};
// 프로젝트 최상단에 생성/수정
const withPWA = require('next-pwa')({
  dest: 'public',            // 서비스 워커 및 PWA 자산을 public에 배치
  disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
module.exports = withPWA({
  // 여기에 기존 Next.js 설정이 있으면 그대로 둡니다
  reactStrictMode: true,
});

export default nextConfig;
