import { DeckBox } from './model/deck-box';

const DEFAULT_DECK_BOXES: Array<{
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
}> = [
  {
    identifier: 'basicblue',
    name: 'Basic Blue',
    imagePath: 'basicblue.png',
    isDefault: true,
    requiresUnlock: false,
    sortOrder: 0,
  },
  {
    identifier: 'basicgreen',
    name: 'Basic Green',
    imagePath: 'basicgreen.png',
    isDefault: true,
    requiresUnlock: false,
    sortOrder: 1,
  },
  {
    identifier: 'basicred',
    name: 'Basic Red',
    imagePath: 'basicred.png',
    isDefault: true,
    requiresUnlock: false,
    sortOrder: 2,
  },
  {
    identifier: 'aurorablastxy6deck',
    name: 'Aurora Blast',
    imagePath: 'aurorablastxy6deck.png',
    isDefault: false,
    requiresUnlock: true,
    sortOrder: 10,
  },
];

/** Insert missing default deck box catalog rows (idempotent). */
export async function seedDefaultDeckBoxes(): Promise<void> {
  for (const entry of DEFAULT_DECK_BOXES) {
    const existing = await DeckBox.findOne({ where: { identifier: entry.identifier } });
    if (existing) {
      continue;
    }
    const row = new DeckBox();
    row.identifier = entry.identifier;
    row.name = entry.name;
    row.imagePath = entry.imagePath;
    row.isDefault = entry.isDefault;
    row.requiresUnlock = entry.requiresUnlock;
    row.sortOrder = entry.sortOrder;
    await row.save();
  }
}
