/** Join class names; skips false, null, undefined, and empty strings. */
export function cn(...parts: Array<string | undefined | null | false>): string {
  return parts.filter(Boolean).join(' ');
}
