/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost","192.168.1.102"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        port: "",
      },
    ],
  },
};

module.exports = nextConfig;
