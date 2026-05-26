export function configuredServerUrl(): string {
  return String(import.meta.env.VITE_DEFAULT_SERVER_URL ?? '').trim().replace(/\/$/, '');
}
