import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create New Password",
  description:
    "Securely choose a new password for your Ensanit account and resume mirroring your daily choices.",
  robots: {
    index: false,
  },
};

export default function ResetPasswordLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
