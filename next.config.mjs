/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["static.narrative-violation.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.narrative-violation.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
