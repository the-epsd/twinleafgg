import { Coin } from './model/coin';

const DEFAULT_COINS: Array<{
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
}> = [
  {
    identifier: 'twinleaf',
    name: 'Twinleaf',
    imagePath: 'twinleaf-coin.png',
    isDefault: true,
    requiresUnlock: false,
    sortOrder: 0,
  },
];

/** Insert missing default coin catalog rows (idempotent). */
export async function seedDefaultCoins(): Promise<void> {
  for (const entry of DEFAULT_COINS) {
    const existing = await Coin.findOne({ where: { identifier: entry.identifier } });
    if (existing) {
      continue;
    }
    const row = new Coin();
    row.identifier = entry.identifier;
    row.name = entry.name;
    row.imagePath = entry.imagePath;
    row.isDefault = entry.isDefault;
    row.requiresUnlock = entry.requiresUnlock;
    row.sortOrder = entry.sortOrder;
    await row.save();
  }
}
