import type { NextConfig } from "next";

const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL || "";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: false,
  images: {
    domains: ["placehold.co"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
                default-src 'self';
                object-src 'self' blob:;
                script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com https://www.gstatic.com https://www.paypal.com https://www.sandbox.paypal.com;
                style-src 'self' 'unsafe-inline';
                img-src 'self' data: https://www.gstatic.com https://www.google.com https://placehold.co https://www.paypal.com https://cdn.discordapp.com https://flagcdn.com;
                font-src 'self' data:;
                connect-src 'self' https://www.paypal.com https://www.sandbox.paypal.com *;
                frame-src https://www.google.com https://www.gstatic.com https://www.paypal.com https://www.sandbox.paypal.com;
                frame-ancestors 'none';
                base-uri 'self';
              `
              .replace(/\s{2,}/g, " ")
              .trim(),
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            // value: "require-corp",
            value: "unsafe-none",
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
      {
        source: "/gamefiles/:path*",
        headers: [
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "same-origin",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: PUBLIC_URL,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type",
          },
          {
            key: "Content-Type",
            value: "application/x-shockwave-flash",
          },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: PUBLIC_URL,
          },
          {
            key: "Cross-Origin-Resource-Policy",
            value: "cross-origin",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      }
    ];
  },
};

export default nextConfig;
