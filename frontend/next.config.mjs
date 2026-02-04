/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      new URL(
        "https://coderplace.net/prestashop/PRS02/PRS02045/demo1/24-home_default/apple-iphone-14-pro-max-64gb-white-fully-unlocked.jpg",
      ),
    ],
  },
};

export default nextConfig;
