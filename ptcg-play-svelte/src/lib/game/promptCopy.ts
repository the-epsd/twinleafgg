import { labelFor } from './labels';
import type { PromptView } from './types';

export function promptMessage(prompt: PromptView): string {
  return labelFor(prompt.message || prompt.type).trim();
}

export function promptClassLabel(prompt: PromptView): string {
  return labelFor(prompt.className).trim();
}

export function promptTitle(prompt: PromptView, fallback?: string): string {
  return promptMessage(prompt) || fallback || promptClassLabel(prompt);
}

export function promptSubtitle(prompt: PromptView, title: string): string | undefined {
  const message = promptMessage(prompt);
  return message && !samePromptCopy(message, title) && !samePromptCopy(message, promptClassLabel(prompt))
    ? message
    : undefined;
}

export function samePromptCopy(left: string | undefined, right: string | undefined): boolean {
  return normalizeCopy(left) === normalizeCopy(right);
}

function normalizeCopy(value: string | undefined) {
  return (value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(prompt|choose|select)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
