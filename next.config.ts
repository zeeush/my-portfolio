import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "10.245.113.200",
    "localhost:3000",
    "*.loca.lt",
    "*.trycloudflare.com",
    "*.untun.io",
    "*.ngrok-free.app",
    "*.pinggy.link",
  ],
};

export default nextConfig;
