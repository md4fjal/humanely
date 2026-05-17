import { BASE_URL, fetcher } from "@/lib/api";

export const updateProfile = (name: string): Promise<any> =>
  fetcher(`${BASE_URL}/user/profile`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

export const resetData = (): Promise<any> =>
  fetcher(`${BASE_URL}/user/reset`, {
    method: "DELETE",
  });
