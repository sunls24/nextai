const REVERSE_HOST =
  process.env.REVERSE_URL?.match(/^(https?:\/\/[^\/]+)/)?.[1];

/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  rewrites: async function () {
    if (!REVERSE_HOST) {
      return [];
    }
    return [
      {
        source: "/api/reverse/:path*",
        destination: `${REVERSE_HOST}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
