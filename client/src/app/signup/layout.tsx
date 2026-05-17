import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account",
  description:
    "Join Ensanit to start mirroring your daily choices, score your actions, and receive mindful reflection of your character.",
  openGraph: {
    title: "Start Your Reflection Journey | Ensanit",
    description:
      "Create an account on Ensanit and begin scoring your daily kindness actions, self-discipline, and character growth.",
  },
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
