import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Cover images render via <Image unoptimized />, which bypasses the image
     optimizer and its host allowlist, so no remotePatterns are needed. */
};

export default nextConfig;
