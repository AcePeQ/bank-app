const API_URL = "/api";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers
    }
  })

  if (!res.ok) {
    throw new Error(`Request failed with status: ${res.status}`);
  }

  return res.json() as Promise<T>;
}