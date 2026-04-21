/** @type {import('next').NextConfig} */
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
const envRemotePattern = (() => {
  if (!apiUrl) return null;

  try {
    const parsed = new URL(apiUrl);
    return {
      protocol: parsed.protocol.replace(":", ""),
      hostname: parsed.hostname,
      ...(parsed.port ? { port: parsed.port } : {}),
      pathname: "/images/**",
    };
  } catch {
    return null;
  }
})();

const remotePatterns = [
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
];

if (
  envRemotePattern &&
  !remotePatterns.some(
    (pattern) =>
      pattern.protocol === envRemotePattern.protocol &&
      pattern.hostname === envRemotePattern.hostname &&
      (pattern.port || "") === (envRemotePattern.port || ""),
  )
) {
  remotePatterns.push(envRemotePattern);
}

const nextConfig = {
  images: {
    remotePatterns,
  },

  async headers() {
    return [
      {
        source: "/:path",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
