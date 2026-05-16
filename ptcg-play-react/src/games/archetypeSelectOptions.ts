import { Archetype } from 'ptcg-server';

export type ArchetypeOption = { value: Archetype; label: string };

/** Archetype options sorted alphabetically by label. */
export function getArchetypeSelectOptions(): ArchetypeOption[] {
  return Object.values(Archetype)
    .filter((v): v is Archetype => typeof v === 'string')
    .map((value) => ({
      value,
      label: value.toString().toLowerCase().replace(/_/g, ' '),
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** Cached list for pickers (Archetype enum is static). */
export const ARCHETYPE_SELECT_OPTIONS: ArchetypeOption[] = getArchetypeSelectOptions();
