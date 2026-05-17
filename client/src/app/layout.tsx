import type { Metadata } from "next";
import "./globals.css";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

// Configure fonts with Next.js
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

export const metadata: Metadata = {
  title: "Humanely — How humanely are you living?",
  description:
    "A private mirror for your daily choices. Track your humanity score, log actions, and reflect on your character with AI.",
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
