// src/lib/jwt.ts
export function decodeUserIdFromToken(token?: string | null): string | null {
    if (!token) return null;
    try {
      const [, payload] = token.split('.');
      const json = JSON.parse(atob(payload));
      // Backend signs: { "User_ID": "..." }
      return json?.User_ID ?? null;
    } catch {
      return null;
    }
  }
  