"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  getTodayLog,
  setIntention,
  addAction,
  removeAction,
  generateReflection,
  generateWeeklySummary,
  getAnalytics,
  type DailyLog,
} from "./api";

export const logKeys = {
  all: ["log"] as const,
  today: () => [...logKeys.all, "today"] as const,
  analytics: () => [...logKeys.all, "analytics"] as const,
};

export const useLog = () => {
  return useQuery({
    queryKey: logKeys.today(),
    queryFn: getTodayLog,
    select: (data) => data.log,
    staleTime: 30_000,
  });
};

export const useSetIntention = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (intention: string) => setIntention(intention),
    onSuccess: (data) => {
      queryClient.setQueryData(logKeys.today(), data);
    },
    onError: () => toast.error("Couldn't save your intention"),
  });
};

export const useAddAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      label,
      type,
    }: {
      label: string;
      type: "positive" | "negative";
    }) => addAction(label, type),
    onMutate: async ({ label, type }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: logKeys.today() });
      const prev = queryClient.getQueryData<{ log: DailyLog }>(
        logKeys.today(),
      );
      if (prev?.log) {
        const optimistic: DailyLog = {
          ...prev.log,
          actions: [
            ...prev.log.actions,
            {
              _id: `temp-${Date.now()}`,
              label,
              type,
              delta: type === "positive" ? 3 : -3,
              loggedAt: new Date().toISOString(),
            },
          ],
        };
        queryClient.setQueryData(logKeys.today(), { log: optimistic });
      }
      return { prev };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(logKeys.today(), data);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(logKeys.today(), ctx.prev);
      toast.error("Couldn't log that action");
    },
  });
};

export const useRemoveAction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (actionId: string) => removeAction(actionId),
    onMutate: async (actionId) => {
      await queryClient.cancelQueries({ queryKey: logKeys.today() });
      const prev = queryClient.getQueryData<{ log: DailyLog }>(
        logKeys.today(),
      );
      if (prev?.log) {
        const optimistic: DailyLog = {
          ...prev.log,
          actions: prev.log.actions.filter((a) => a._id !== actionId),
        };
        queryClient.setQueryData(logKeys.today(), { log: optimistic });
      }
      return { prev };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(logKeys.today(), data);
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(logKeys.today(), ctx.prev);
      toast.error("Couldn't remove that action");
    },
  });
};

export const useGenerateReflection = () => {
  return useMutation({
    mutationFn: generateReflection,
    onError: () => toast.error("Could not connect. Please try again."),
  });
};

export const useAnalytics = () => {
  return useQuery({
    queryKey: logKeys.analytics(),
    queryFn: getAnalytics,
    select: (data) => data.history,
    staleTime: 60_000,
  });
};

export const useGenerateWeekly = () => {
  return useMutation({
    mutationFn: generateWeeklySummary,
    onError: () => toast.error("Could not connect. Please try again."),
  });
};
