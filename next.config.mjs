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
    domains: ["static.narrative-violation.com", "static.colosseum.org", "arena.colosseum.org"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "static.narrative-violation.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "static.colosseum.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "arena.colosseum.org",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
