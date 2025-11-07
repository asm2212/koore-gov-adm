const TOKEN_KEY = "portal_token";

/**
 * Retrieve JWT token safely (only works in browser)
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null; // SSR safety
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Save JWT token
 */
export function setToken(token: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove JWT token
 */
export function removeToken() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Decode JWT and return user role
 */
export function getRole(token?: string): string | null {
  if (!token) token = getToken() || undefined;
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role || null;
  } catch {
    return null;
  }
}
