import { API_BASE_URL } from "@/lib/constants";

export default async function fetchAPI<T = unknown>(
  endpoint: string,
  options: RequestInit & { guest?: boolean } = {}
): Promise<T | null> {
  const guest = options.guest ?? false;
  let token = guest ? null : localStorage.getItem("chatbotToken");
  const guestSessionId = localStorage.getItem("guestSessionId");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(guest && guestSessionId ? { "X-Guest-Session": guestSessionId } : {}),
    ...options.headers,
  };

  const { guest: _, ...restOptions } = options; // eslint-disable-line @typescript-eslint/no-unused-vars

  let res = await fetch(`${API_BASE_URL}${endpoint}`, { ...restOptions, headers });

  if (!guest && res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem("chatbotToken");
      const retryHeaders: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...restOptions,
        headers: retryHeaders,
      });
    } else {
      if (guest) {
        throw new Error("Guest session expired or invalid.");
      }

      localStorage.removeItem("chatbotUser");
      localStorage.removeItem("chatbotToken");
      throw new Error("Unauthorized. Please log in again.");
    }
  }

  if (!res.ok) {
    let errorMsg = "Something went wrong";
    try {
      const errorData = await res.json();
      errorMsg = errorData.message || errorMsg;
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(errorMsg);
  }

  if (res.status === 204) return null;

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return null;
}

async function refreshAccessToken(): Promise<boolean> {
  const userString = localStorage.getItem("chatbotUser");
  if (!userString) return false;

  try {
    const user = JSON.parse(userString);

    if (user?.isGuest) return false;

    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include", 
    });

    if (!res.ok) return false;

    const data = await res.json().catch(() => null);
    if (!data?.token) return false;

    localStorage.setItem("chatbotToken", data.token);
    return true;
  } catch {
    return false;
  }
}