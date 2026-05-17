import type { Metadata, Viewport } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const cormorantGaramond = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const viewport: Viewport = {
  themeColor: "#C8973A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://ensanit.com",
  ),
  title: {
    default: "Ensanit — How humanely are you living?",
    template: "%s | Ensanit",
  },
  description:
    "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
  keywords: [
    "humanity score",
    "self-reflection",
    "character tracker",
    "AI reflection",
    "moral compass",
    "ensanit",
    "personal growth",
    "daily choices",
    "mindful living",
    "ethical habit tracker",
  ],
  authors: [{ name: "Ensanit Team" }],
  creator: "Ensanit",
  publisher: "Ensanit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ensanit.com",
    title: "Ensanit — How humanely are you living?",
    description:
      "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
    siteName: "Ensanit",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ensanit — How humanely are you living?",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ensanit — How humanely are you living?",
    description:
      "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
    images: ["/og-image.png"],
    creator: "@ensanit",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "google-site-verification-token",
    yandex: "yandex-verification-token",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorantGaramond.variable} ${dmSans.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://ensanit.com/#organization",
                  name: "Ensanit",
                  url: "https://ensanit.com",
                  logo: {
                    "@type": "ImageObject",
                    url: "https://ensanit.com/favicon.ico",
                    caption: "Ensanit Logo",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://ensanit.com/#website",
                  url: "https://ensanit.com",
                  name: "Ensanit",
                  potentialAction: {
                    "@type": "SearchAction",
                    target: "https://ensanit.com/login?q={search_term_string}",
                    "query-input": "required name=search_term_string",
                  },
                },
                {
                  "@type": "WebApplication",
                  "@id": "https://ensanit.com/#webapp",
                  url: "https://ensanit.com",
                  name: "Ensanit",
                  applicationCategory:
                    "LifestyleApplication, MindfulnessApplication",
                  operatingSystem: "All",
                  description:
                    "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
                  offers: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "USD",
                  },
                },
              ],
            }),
          }}
        />
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "dummy"}
        >
          <QueryProvider>{children}</QueryProvider>
        </GoogleOAuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#12121A",
              color: "#EDE9DF",
              border: "1px solid #1E1E2E",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#5BB87A", secondary: "#12121A" },
            },
            error: {
              iconTheme: { primary: "#C85E5E", secondary: "#12121A" },
            },
          }}
        />
      </body>
    </html>
  );
}
