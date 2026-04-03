import { env } from "../config/env";
import { useAuthStore } from "../store/authStore";

export interface SavedDesignDto {
  id: string;
  title: string;
  roomType: string;
  width: number;
  length: number;
  wallColor: string;
  items: string[];
  createdAt?: string;
}

async function parseJson(res: Response): Promise<unknown> {
  const t = await res.text();
  if (!t) return {};
  try {
    return JSON.parse(t) as unknown;
  } catch {
    return {};
  }
}

async function authRequest(path: string, init: RequestInit = {}) {
  const token = useAuthStore.getState().token;
  if (!token) throw new Error("Login required");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string>),
  };
  headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${env.apiBaseUrl}${path}`, { ...init, headers });
  const data = (await parseJson(res)) as { error?: string };

  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}

export const designsService = {
  async list(): Promise<{ designs: SavedDesignDto[] }> {
    const data = (await authRequest("/designs")) as { designs: SavedDesignDto[] };
    return { designs: data.designs ?? [] };
  },

  async save(payload: {
    title?: string;
    roomType: string;
    width: number;
    length: number;
    wallColor: string;
    items: string[];
  }) {
    return authRequest("/designs", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async delete(id: string) {
    return authRequest(`/designs/${id}`, {
      method: "DELETE",
    });
  },
};
