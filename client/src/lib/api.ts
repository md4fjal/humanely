export const BASE_URL = "http://localhost:5000/api";

export const fetcher = async (
  url: string,
  options?: RequestInit,
  retry = true,
): Promise<any> => {
  const res = await fetch(url, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  // If unauthorized → try refresh once
  if (res.status === 401 && retry) {
    console.log(
      "FETCH INTERCEPTOR: Received 401. Attempting to refresh token...",
    );
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      console.log(
        "FETCH INTERCEPTOR: Refresh response status:",
        refreshRes.status,
      );

      if (refreshRes.ok) {
        console.log(
          "FETCH INTERCEPTOR: Refresh successful, retrying original request to:",
          url,
        );
        return fetcher(url, options, false);
      } else {
        console.error(
          "FETCH INTERCEPTOR: Refresh failed (not ok). Redirecting to login...",
        );
        if (typeof window !== "undefined") {
          window.location.href = "/login";
        }
        throw new Error("Session expired");
      }
    } catch (refreshErr) {
      console.error(
        "FETCH INTERCEPTOR: Refresh fetch THREW an exception:",
        refreshErr,
      );
      throw refreshErr;
    }
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    throw new Error(data?.message || "Something went wrong");
  }

  return data;
};
