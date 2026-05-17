import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ensanit.com";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/login", "/signup", "/forgot-password", "/reset-password"],
      disallow: [
        "/onboarding",
        "/confession",
        "/history",
        "/log",
        "/reflect",
        "/settings",
        "/traits",
        "/weekly",
        "/api/",      // Protect backend endpoints from crawlers
        "/_next/",    // Protect Next.js internal files
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
