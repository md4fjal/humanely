"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile, resetData } from "./api";
import { authKeys } from "../auth/hooks";
import { logKeys } from "../log/hooks";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => updateProfile(name),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.me() });
      toast.success("Profile updated");
    },
    onError: () => toast.error("Couldn't update profile"),
  });
};

export const useResetData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resetData,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logKeys.all });
      toast.success("All data reset successfully");
    },
    onError: () => toast.error("Couldn't reset data"),
  });
};
