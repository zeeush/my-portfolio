import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  allowedDevOrigins: [
    "**.run.app",
    "ais-dev-njeamcxjf72pkx3adhpelv-338700812422.asia-east1.run.app",
    "ais-pre-njeamcxjf72pkx3adhpelv-338700812422.asia-east1.run.app",
    "**.google.com",
    "**.googleusercontent.com",
    "10.245.113.200",
    "localhost:3000",
    "**.loca.lt",
    "**.trycloudflare.com",
    "**.untun.io",
    "**.ngrok-free.app",
    "**.pinggy.link",
  ],
};

export default nextConfig;
