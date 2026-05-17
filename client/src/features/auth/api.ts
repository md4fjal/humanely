import { BASE_URL, fetcher } from "@/lib/api";

export const signupUser = (data: {
  name: string;
  username: string;
  email: string;
  password: string;
}) => {
  return fetcher(`${BASE_URL}/auth/signup`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const verifyOtpUser = (data: { email: string; otp: string }) => {
  return fetcher(`${BASE_URL}/auth/verify-otp`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const loginUser = (data: { username: string; password: string }) => {
  return fetcher(`${BASE_URL}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const googleLoginUser = (data: { token: string }) => {
  return fetcher(`${BASE_URL}/auth/google`, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

export const logoutUser = () => {
  return fetcher(`${BASE_URL}/auth/logout`, {
    method: "POST",
  });
};
