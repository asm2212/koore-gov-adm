const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";
const TOKEN_KEY = "portal_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function request<T>(
  method: HttpMethod,
  url: string,
  body?: unknown,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_URL}${url}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    ...options,
  });

  let data: any = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }

  if (!res.ok) {
    const message = data?.error || data?.message || `HTTP ${res.status}`;
    const err: any = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

const api = {
  get: <T>(url: string, options?: RequestInit) => request<T>("GET", url, undefined, options),
  post: <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>("POST", url, body, options),
  put:  <T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>("PUT", url, body, options),
  patch:<T>(url: string, body?: unknown, options?: RequestInit) =>
    request<T>("PATCH", url, body, options),
  delete:<T>(url: string, options?: RequestInit) => request<T>("DELETE", url, undefined, options),
};

export default api;

