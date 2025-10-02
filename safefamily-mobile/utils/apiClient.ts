import { getToken, removeToken } from "./secureStore";
import { router } from "expo-router";
import config from "./config";

const API_BASE_URL = config.API_URL;

// Generic API fetcher
export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    await removeToken();
    router.replace("/login");
    throw new Error("Session expired. Please log in again.");
  }

  if (!res.ok) {
    let errMsg = "Something went wrong";
    try {
      const errData = await res.json();
      errMsg = errData.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  return res.json() as Promise<T>;
}