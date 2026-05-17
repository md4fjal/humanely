"use client";

import { useAuth } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (isError || !data?.user)) {
      router.replace("/login");
    } else if (!isLoading && data?.user && !data.user.isOnboarded) {
      router.replace("/onboarding");
    }
  }, [isLoading, isError, data, router]);

  if (isLoading) return <Loader />;

  if (isError || !data?.user || !data.user.isOnboarded) {
    return <Loader />; // Return loader while redirecting
  }

  return <>{children}</>;
}
