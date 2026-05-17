import { BASE_URL, fetcher } from "@/lib/api";

export interface Action {
  _id: string;
  label: string;
  type: "positive" | "negative";
  delta: number;
  loggedAt: string;
}

export interface DailyLog {
  _id: string;
  date: string;
  intention: string;
  actions: Action[];
  humanityScore: number;
  traits: {
    compassion: number;
    honesty: number;
    discipline: number;
    patience: number;
    gratitude: number;
  };
}

export const getTodayLog = (): Promise<{ log: DailyLog }> =>
  fetcher(`${BASE_URL}/log/today`);

export const setIntention = (intention: string): Promise<{ log: DailyLog }> =>
  fetcher(`${BASE_URL}/log/intention`, {
    method: "POST",
    body: JSON.stringify({ intention }),
  });

export const addAction = (
  label: string,
  type: "positive" | "negative",
): Promise<{ log: DailyLog }> =>
  fetcher(`${BASE_URL}/log/actions`, {
    method: "POST",
    body: JSON.stringify({ label, type }),
  });

export const removeAction = (actionId: string): Promise<{ log: DailyLog }> =>
  fetcher(`${BASE_URL}/log/actions/${actionId}`, { method: "DELETE" });

export const generateReflection = (): Promise<{ reflection: string }> =>
  fetcher(`${BASE_URL}/reflection/generate`, { method: "POST" });

export const getAnalytics = (): Promise<{
  history: { date: string; score: number; rating: string }[];
}> => fetcher(`${BASE_URL}/log/analytics`);
