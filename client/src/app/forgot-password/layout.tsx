import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reset Password",
  description:
    "Recover access to your Ensanit account securely. Enter your registered email address to receive your password reset links.",
  robots: {
    index: false,
  },
};

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
