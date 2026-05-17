"use client";

import { useAuth } from "@/features/auth/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "./Loader";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, isLoading, isError } = useAuth();
  const router = useRouter();
  const [isOnboarded, setIsOnboarded] = useState<boolean | null>(null);

  useEffect(() => {
    setIsOnboarded(localStorage.getItem("ensanit_onboarded") === "true");
  }, []);

  useEffect(() => {
    if (!isLoading && (isError || !data?.user)) {
      router.replace("/login");
    } else if (!isLoading && data?.user && isOnboarded === false) {
      router.replace("/onboarding");
    }
  }, [isLoading, isError, data, router, isOnboarded]);

  if (isLoading || isOnboarded === null) return <Loader />;

  if (isError || !data?.user || isOnboarded === false) {
    return <Loader />; // Return loader while redirecting
  }

  return <>{children}</>;
}
