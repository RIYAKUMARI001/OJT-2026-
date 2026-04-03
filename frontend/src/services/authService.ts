import { env } from "../config/env";

async function parseJsonSafe(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { error: text.slice(0, 200) };
  }
}

function networkHint(): string {
  return `Cannot reach ${env.apiBaseUrl}. Same Wi‑Fi as PC? Backend running (port 5000)? Set EXPO_PUBLIC_API_BASE_URL if needed.`;
}

export const authService = {
  async register(name: string, email: string, pass: string) {
    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: pass }),
      });
      const data = (await parseJsonSafe(res)) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Registration failed");
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "Network request failed") {
        throw new Error(networkHint());
      }
      throw e instanceof Error ? e : new Error(msg);
    }
  },

  async login(email: string, pass: string) {
    try {
      const res = await fetch(`${env.apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = (await parseJsonSafe(res)) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Login failed");
      return data;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg === "Network request failed") {
        throw new Error(networkHint());
      }
      throw e instanceof Error ? e : new Error(msg);
    }
  },
};
