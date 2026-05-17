import en from './locales/en.json';

type TranslationOptions = Record<string, unknown> & {
  defaultValue?: string;
};

export type TFunction = (key: string, optionsOrDefault?: TranslationOptions | string) => string;

const strings = en as Record<string, unknown>;

function lookup(key: string): string | undefined {
  const direct = strings[key];
  if (typeof direct === 'string') {
    return direct;
  }

  let current: unknown = strings;
  for (const part of key.split('.')) {
    if (current && typeof current === 'object' && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

function interpolate(template: string, options?: TranslationOptions): string {
  if (!options) {
    return template;
  }
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, name) => {
    const value = options[name];
    return value === undefined || value === null ? match : String(value);
  });
}

export function t(key: string, optionsOrDefault?: TranslationOptions | string): string {
  const options = typeof optionsOrDefault === 'string' ? undefined : optionsOrDefault;
  const fallback = typeof optionsOrDefault === 'string' ? optionsOrDefault : optionsOrDefault?.defaultValue;
  return interpolate(lookup(key) ?? fallback ?? key, options);
}

export function hasTranslation(key: string): boolean {
  return lookup(key) !== undefined;
}

export function useTranslation(): { t: TFunction } {
  return { t };
}
