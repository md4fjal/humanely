"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { updateProfile, resetData, changePassword } from "./api";
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

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: (data: any) => {
      toast.success(data.message || "Password updated successfully");
    },
    onError: (err: Error) => toast.error(err.message || "Couldn't update password"),
  });
};
