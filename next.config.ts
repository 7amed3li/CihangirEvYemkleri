import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // Required because the app now has multiple root layouts ([locale] and admin)
    // so each can server-render its own <html lang>.
    globalNotFound: true,
  },
  async redirects() {
    return [
      // Bare domain → default-locale home. Kept temporary (307), matching the
      // previous redirect() behaviour, so a future language-negotiation step
      // can be added without a cached permanent redirect.
      { source: "/", destination: "/tr", permanent: false },
      // Redirect localized admin paths to unlocalized canonical admin
      {
        source: "/:locale(tr|en|ar|ru|fa|fr|de|it|es|zh)/admin/:path*",
        destination: "/admin/:path*",
        permanent: false,
      },
      {
        source: "/:locale(tr|en|ar|ru|fa|fr|de|it|es|zh)/admin",
        destination: "/admin",
        permanent: false,
      },
      // Developer / Case Study aliases
      {
        source: "/tasarim-gelistirme",
        destination: "/tr/tasarim-gelistirme",
        permanent: false,
      },
      {
        source: "/developer",
        destination: "/tr/tasarim-gelistirme",
        permanent: false,
      },
      {
        source: "/:locale(tr|en|ar|ru|fa|fr|de|it|es|zh)/developer",
        destination: "/:locale/tasarim-gelistirme",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
