/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "coderplace.net",
        pathname: "/prestashop/PRS02/PRS02045/demo1/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5000",
        pathname: "/images/**",
      },
    ],
  },
};

export default nextConfig;
