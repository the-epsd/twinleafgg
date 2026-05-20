import { describe, expect, it } from 'vitest';
import { SAMPLE_DECK } from '../lib/game/deckImport';
import { parseLocalGameDecks } from './deckImportModel';

describe('deck import model', () => {
  it('returns parsed cards for both local players', () => {
    const decks = parseLocalGameDecks(SAMPLE_DECK, SAMPLE_DECK);

    expect(decks.ok).toBe(true);
    if (decks.ok) {
      expect(decks.player1Cards).toHaveLength(60);
      expect(decks.player2Cards).toHaveLength(60);
    }
  });

  it('prefixes parse errors with the player number', () => {
    const decks = parseLocalGameDecks('Bad Card', '');

    expect(decks.ok).toBe(false);
    if (!decks.ok) {
      expect(decks.error).toContain('Player 1: Line 1: card names must include a set code');
      expect(decks.error).toContain('Player 2: Deck is empty.');
    }
  });
});
