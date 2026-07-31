/** Tiny compatibility helpers so browse UI can show a stable "local data" source label. */

import { clearLocalCache } from './localData';

export type DataSource = 'local';

let note = 'Using local PokemonTCG/pokemon-tcg-data JSON (no live API).';

export function getActiveSource(): { source: DataSource; note: string } {
  return { source: 'local', note };
}

export function setActiveSource(_source: DataSource, nextNote = ''): void {
  if (nextNote) note = nextNote;
}

export async function resetDataSource(): Promise<void> {
  clearLocalCache();
  note = 'Using local PokemonTCG/pokemon-tcg-data JSON (no live API).';
}
