import { parseDeckList } from '../lib/game/deckImport';

export type LocalGameDecks =
  | {
      ok: true;
      player1Cards: string[];
      player2Cards: string[];
    }
  | {
      ok: false;
      error: string;
    };

export function parseLocalGameDecks(deck1Text: string, deck2Text: string): LocalGameDecks {
  const p1 = parseDeckList(deck1Text);
  const p2 = parseDeckList(deck2Text);
  if (p1.errors.length || p2.errors.length) {
    return {
      ok: false,
      error: [...p1.errors.map((error) => `Player 1: ${error}`), ...p2.errors.map((error) => `Player 2: ${error}`)].join(
        '\n',
      ),
    };
  }
  return {
    ok: true,
    player1Cards: p1.cards,
    player2Cards: p2.cards,
  };
}
