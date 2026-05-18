import { describe, expect, it } from 'vitest';
import { parseDeckList, SAMPLE_DECK } from './deckImport';

describe('deck import', () => {
  it('skips section count headers and expands the default deck to 60 cards', () => {
    const parsed = parseDeckList(SAMPLE_DECK);

    expect(parsed.errors).toEqual([]);
    expect(parsed.cards).toHaveLength(60);
    expect(parsed.cards).toContain('Dreepy TWM');
    expect(parsed.cards).toContain('Poke Pad POR');
    expect(parsed.cards).not.toContain('Dreepy TWM 128');
    expect(parsed.cards).not.toContain('Poke Pad POR 81');
    expect(parsed.cards).not.toContain('Pokémon: 20');
    expect(parsed.cards).not.toContain('Trainer: 32');
    expect(parsed.cards).not.toContain('Energy: 8');
  });
});
