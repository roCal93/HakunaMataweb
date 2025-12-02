const DEFAULT_SITE_URL = 'https://hakunamataweb.com';

function sanitizeUrl(candidate?: string | null): string | null {
  if (!candidate) {
    return null;
  }
  try {
    const normalized = new URL(candidate);
    return normalized.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  const envUrl = sanitizeUrl(process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? null);
  return envUrl ?? DEFAULT_SITE_URL;
}

export function buildAbsoluteUrl(path = '/'): string {
  const base = getSiteUrl();
  try {
    return new URL(path, `${base}/`).toString();
  } catch {
    return base;
  }
}
