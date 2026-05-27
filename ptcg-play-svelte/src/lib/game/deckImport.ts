export type ParsedDeck = {
  cards: string[];
  errors: string[];
};

export const SAMPLE_DECK = `Pokémon: 20
4 Dreepy TWM
4 Drakloak TWM
3 Dragapult ex TWM
2 Munkidori TWM 95
2 Meowth ex POR
1 Budew PRE
1 Fezandipiti ex SFA
1 Bloodmoon Ursaluna ex TWM
1 Latias ex SSP
1 Chien-Pao SSP

Trainer: 32
4 Lillie's Determination MEG
4 Boss's Orders MEG
2 Crispin SCR
2 Brock's Scouting JTG
4 Buddy-Buddy Poffin TEF
4 Poke Pad POR
4 Ultra Ball MEG
3 Rare Candy MEG
2 Night Stretcher SFA
1 Unfair Stamp TWM
2 Area Zero Underdepths SCR

Energy: 8
3 Fire Energy SVE
3 Psychic Energy SVE
2 Darkness Energy SVE`;

export function parseDeckList(text: string): ParsedDeck {
  const cards: string[] = [];
  const errors: string[] = [];
  const lines = text.split(/\r?\n/);

  lines.forEach((rawLine, idx) => {
    const line = rawLine.replace(/\s+#.*$/, '').trim();
    if (!line) {
      return;
    }
    if (/^[^\d:][^:]+:\s*\d+\s*$/.test(line)) {
      return;
    }

    const match = line.match(/^(\d+)\s+(.+)$/);
    const count = match ? Number(match[1]) : 1;
    const name = (match ? match[2] : line)?.trim() ?? '';
    if (!Number.isInteger(count) || count < 1 || count > 60) {
      errors.push(`Line ${idx + 1}: invalid count.`);
      return;
    }
    const tokens = name.split(/\s+/);
    const hasCollectorNumber = /^\d+[a-z]?$/i.test(tokens.at(-1) ?? '');
    const setCode = hasCollectorNumber ? tokens.at(-2) : tokens.at(-1);
    if (!name || !/^[A-Z0-9-]{2,8}$/.test(setCode ?? '')) {
      errors.push(`Line ${idx + 1}: card names must include a set code, for example "Ralts SIT".`);
      return;
    }
    const normalizedName = normalizeImportName(hasCollectorNumber ? tokens.slice(0, -1).join(' ') : name);
    for (let i = 0; i < count; i += 1) {
      cards.push(normalizedName);
    }
  });

  if (cards.length === 0) {
    errors.push('Deck is empty.');
  }

  return { cards, errors };
}

function normalizeImportName(name: string): string {
  return name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
