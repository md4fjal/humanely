import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
  description:
    "Log in to Ensanit to track your daily humanity score, record ethical habits, and reflect on your daily character choices with AI analysis.",
  openGraph: {
    title: "Sign In to Ensanit | Mindful Daily Reflection",
    description:
      "Access your private mirror for daily choices, character tracking, and moral analysis with artificial intelligence.",
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
