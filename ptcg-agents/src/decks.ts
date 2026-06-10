import * as fs from 'fs';

// Built-in fixture decks for harness runs. Card names are engine fullNames.
// A deck is a flat list of 60 card names; repeat a name for multiple copies.

function deck(entries: Array<[number, string]>): string[] {
  return entries.flatMap(([count, name]) => Array(count).fill(name));
}

export const FIXTURE_DECKS: Record<string, string[]> = {
  // Simple Lightning deck: basics, one evolution line, staple trainers.
  // Exercises evolution, supporters, search/switch/heal prompts and energy attach.
  'lightning-fixture': deck([
    [4, 'Pikachu SIT 49'],
    [3, 'Raichu SIT'],
    [4, 'Professor\'s Research SVI'],
    [4, 'Nest Ball SVI'],
    [3, 'Switch SVI'],
    [3, 'Potion SVI'],
    [39, 'Lightning Energy SVE']
  ])
};

// Resolves a deck by fixture name, or by path to a JSON file containing a
// flat array of card fullName strings.
export function getDeck(nameOrPath: string): string[] {
  const fixture = FIXTURE_DECKS[nameOrPath];
  if (fixture) {
    return fixture;
  }
  if (fs.existsSync(nameOrPath)) {
    const cards = JSON.parse(fs.readFileSync(nameOrPath, 'utf8'));
    if (!Array.isArray(cards) || cards.some(card => typeof card !== 'string')) {
      throw new Error(`Deck file ${nameOrPath} must be a JSON array of card name strings`);
    }
    return cards;
  }
  throw new Error(`Unknown deck "${nameOrPath}". Fixtures: ${Object.keys(FIXTURE_DECKS).join(', ')}`);
}
