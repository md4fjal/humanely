"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { BASE_URL, fetcher } from "@/lib/api";
import { loginUser, logoutUser, signupUser, googleLoginUser } from "./api";

export const authKeys = {
  all: ["auth"] as const,
  me: () => [...authKeys.all, "me"] as const,
};

export const useAuth = () => {
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: () => fetcher(`${BASE_URL}/user/profile`),
  });
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.success("Successfully logged in!");
      router.push("/");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to login");
    },
  });
};

export const useGoogleLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: googleLoginUser,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.success("Successfully logged in with Google!");
      router.push("/");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Failed to login with Google");
    },
  });
};

export const useSignup = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signupUser,
    onSuccess: () => {
      toast.success("Account created successfully!");
      router.push("/login");
    },
    onError: (err: Error) => {
      toast.error(err.message || "Registration failed");
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out safely");
      router.push("/login");
    },
    onError: () => {
      toast.error("Failed to logout completely");
    },
  });
};
