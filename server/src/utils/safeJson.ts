export const safeJson = <T = any>(
  raw: string | null | undefined,
  fallback: T,
): T => {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
