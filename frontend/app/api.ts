export const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  (typeof window === "undefined" ? "http://localhost:8010" : `${window.location.protocol}//${window.location.hostname}:8010`);


export async function readResponseErrorDetail(response: Response) {
  const rawError = await response.text();
  if (!rawError) {
    return "";
  }
  try {
    const payload = JSON.parse(rawError) as { detail?: unknown };
    return typeof payload.detail === "string" ? payload.detail : rawError;
  } catch {
    return rawError;
  }
}


export async function throwResponseError(response: Response, fallbackMessage: string): Promise<never> {
  const detail = await readResponseErrorDetail(response);
  throw new Error(detail || `${fallbackMessage} (${response.status})`);
}


export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const detail = await readResponseErrorDetail(response);
    if (response.status === 401 && detail === "Not authenticated" && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("peracha:auth-lost"));
    }
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}


export function websocketUrl(roomId: string) {
  const url = new URL(API_BASE);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `/ws/rooms/${roomId}`;
  return url.toString();
}


export function apiUrl(path: string) {
  return path.startsWith("http") || path.startsWith("data:") ? path : `${API_BASE}${path}`;
}
