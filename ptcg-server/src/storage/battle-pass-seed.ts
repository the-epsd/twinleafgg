import * as fs from 'fs';
import * as path from 'path';
import { AvatarCatalog } from './avatar-catalog';
import { BattlePassReward, BattlePassRewardType } from './battle-pass-reward';
import { BattlePassSeason } from './battle-pass-season';
import { Sleeve } from './model/sleeve';
import { UserUnlockedItem } from './user-unlocked-item';

const LEGACY_AVATAR_CATALOG: Array<{
  identifier: string;
  name: string;
  fileName: string;
  isDefault: boolean;
  sortOrder: number;
}> = [
  { identifier: 'predefined_2', name: 'gg', fileName: 'predefined_2.png', isDefault: true, sortOrder: 2 },
  { identifier: 'predefined_3', name: 'um', fileName: 'predefined_3.png', isDefault: true, sortOrder: 3 },
  { identifier: 'predefined_4', name: 'gr', fileName: 'predefined_4.png', isDefault: true, sortOrder: 4 },
  { identifier: 'predefined_5', name: 'gd', fileName: 'predefined_5.png', isDefault: true, sortOrder: 5 },
  { identifier: 'avatar_150', name: 'Mewtwo Avatar', fileName: 'av_5.png', isDefault: false, sortOrder: 100 },
  { identifier: 'avatar_shadow_rider', name: 'Shadow Rider', fileName: 'av_4.png', isDefault: false, sortOrder: 101 },
  { identifier: 'avatar_pao', name: 'Pao', fileName: 'pao.webp', isDefault: false, sortOrder: 102 },
  { identifier: 'avatar_151', name: 'Mew Avatar', fileName: 'mew.png', isDefault: false, sortOrder: 103 },
];

function normalizeRewardType(raw: string): BattlePassRewardType {
  if (raw === 'card_back' || raw === 'marker') {
    return 'sleeve';
  }
  if (raw === 'avatar' || raw === 'sleeve' || raw === 'playmat' || raw === 'deck_box' || raw === 'card_art' || raw === 'coin') {
    return raw;
  }
  return 'avatar';
}

function seasonsJsonDir(): string {
  return path.join(__dirname, 'battle-pass-seasons');
}

async function seedAvatarCatalog(): Promise<void> {
  for (const entry of LEGACY_AVATAR_CATALOG) {
    const existing = await AvatarCatalog.findOne({ where: { identifier: entry.identifier } });
    if (existing) {
      continue;
    }
    const row = new AvatarCatalog();
    row.identifier = entry.identifier;
    row.name = entry.name;
    row.fileName = entry.fileName;
    row.isDefault = entry.isDefault;
    row.sortOrder = entry.sortOrder;
    await row.save();
  }
}

async function seedSeasonRewardsFromJson(): Promise<void> {
  const seasons = await BattlePassSeason.find();
  const dir = seasonsJsonDir();

  for (const season of seasons) {
    if (!season.status) {
      season.status = 'published';
      await season.save();
    }

    const existingCount = await BattlePassReward.count({ where: { seasonId: season.seasonId } });
    if (existingCount > 0) {
      continue;
    }

    const jsonPath = path.join(dir, `${season.seasonId}.json`);
    if (!fs.existsSync(jsonPath)) {
      continue;
    }

    try {
      const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
      if (!Array.isArray(raw)) {
        continue;
      }
      let sortOrder = 0;
      for (const entry of raw) {
        if (entry?.isPremium) {
          continue;
        }
        const reward = new BattlePassReward();
        reward.seasonId = season.seasonId;
        reward.seasonInternalId = season.id;
        reward.level = Number(entry.level) || 1;
        reward.rewardType = normalizeRewardType(String(entry.type || 'avatar'));
        reward.itemId = String(entry.item || '');
        reward.name = String(entry.name || reward.itemId);
        reward.sortOrder = sortOrder++;
        if (!reward.itemId) {
          continue;
        }
        await reward.save();
      }
      console.log(`[BattlePassSeed] Imported rewards for season ${season.seasonId} from JSON`);
    } catch (error) {
      console.error(`[BattlePassSeed] Failed importing ${jsonPath}`, error);
    }
  }
}

async function seedSleeveUnlockFlags(): Promise<void> {
  const sleeves = await Sleeve.find();
  for (const sleeve of sleeves) {
    if (sleeve.isDefault && sleeve.requiresUnlock) {
      sleeve.requiresUnlock = false;
      await sleeve.save();
    }
  }

  // Preserve pre-rework behavior (all sleeves usable) until sleeve rewards exist.
  const sleeveRewardCount = await BattlePassReward.count({ where: { rewardType: 'sleeve' } });
  if (sleeveRewardCount === 0) {
    for (const sleeve of sleeves) {
      if (!sleeve.isDefault && sleeve.requiresUnlock) {
        sleeve.requiresUnlock = false;
        await sleeve.save();
      }
    }
  }
}

async function migrateLegacyUnlockTypes(): Promise<void> {
  const legacy = await UserUnlockedItem.find({ where: { itemType: 'card_back' } });
  for (const item of legacy) {
    item.itemType = 'sleeve';
    await item.save();
  }
  const markers = await UserUnlockedItem.find({ where: { itemType: 'marker' } });
  for (const item of markers) {
    item.itemType = 'sleeve';
    await item.save();
  }
}

/** Idempotent boot seed for Battle Pass DB rework. */
export async function seedBattlePassData(): Promise<void> {
  try {
    await seedAvatarCatalog();
    await seedSeasonRewardsFromJson();
    await seedSleeveUnlockFlags();
    await migrateLegacyUnlockTypes();
    console.log('[BattlePassSeed] Complete');
  } catch (error) {
    console.error('[BattlePassSeed] Failed', error);
  }
}
