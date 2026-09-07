import { LessThanOrEqual } from 'typeorm';
import { config } from '../../config';
import { AvatarCatalog } from '../../storage/avatar-catalog';
import { BattlePassReward } from '../../storage/battle-pass-reward';
import { BattlePassSeason } from '../../storage/battle-pass-season';
import { Sleeve } from '../../storage/model/sleeve';
import { DeckBox } from '../../storage/model/deck-box';

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Newest published season within its date window. */
export async function findCurrentBattlePassSeason(): Promise<BattlePassSeason | null> {
  const today = todayIsoDate();
  const candidates = await BattlePassSeason.find({
    where: {
      status: 'published',
      startDate: LessThanOrEqual(today),
    },
    order: { startDate: 'DESC' },
    relations: ['rewards'],
  });

  for (const season of candidates) {
    if (!season.endDate) {
      return season;
    }
    const end = typeof season.endDate === 'string'
      ? season.endDate
      : new Date(season.endDate).toISOString().slice(0, 10);
    if (end >= today) {
      return season;
    }
  }
  return null;
}

export async function findSeasonWithRewards(seasonId: string): Promise<BattlePassSeason | undefined> {
  return BattlePassSeason.findOne({
    where: { seasonId },
    relations: ['rewards'],
  });
}

export function avatarImageUrl(fileName: string): string {
  return config.backend.avatarsUrl.replace('{name}', fileName);
}

export function sleeveImageUrl(imagePath: string): string {
  return config.backend.sleevesUrl.replace('{path}', imagePath);
}

export function deckBoxImageUrl(imagePath: string): string {
  return config.backend.deckBoxesUrl.replace('{path}', imagePath);
}

export async function resolveRewardImageUrl(reward: BattlePassReward): Promise<string | null> {
  if (reward.rewardType === 'avatar') {
    const avatar = await AvatarCatalog.findOne({ where: { identifier: reward.itemId } });
    return avatar ? avatarImageUrl(avatar.fileName) : null;
  }
  if (reward.rewardType === 'sleeve') {
    const sleeve = await Sleeve.findOne({ where: { identifier: reward.itemId } });
    return sleeve ? sleeveImageUrl(sleeve.imagePath) : null;
  }
  if (reward.rewardType === 'deck_box') {
    const deckBox = await DeckBox.findOne({ where: { identifier: reward.itemId } });
    return deckBox ? deckBoxImageUrl(deckBox.imagePath) : null;
  }
  return null;
}

export interface SerializedBattlePassReward {
  id?: number;
  level: number;
  item: string;
  type: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
  isPremium: boolean;
}

export async function serializeReward(reward: BattlePassReward): Promise<SerializedBattlePassReward> {
  return {
    id: reward.id,
    level: reward.level,
    item: reward.itemId,
    type: reward.rewardType,
    name: reward.name,
    imageUrl: await resolveRewardImageUrl(reward),
    sortOrder: reward.sortOrder,
    isPremium: false,
  };
}

export async function serializeRewards(rewards: BattlePassReward[]): Promise<SerializedBattlePassReward[]> {
  const sorted = [...rewards].sort((a, b) => a.level - b.level || a.sortOrder - b.sortOrder || a.id - b.id);
  return Promise.all(sorted.map(serializeReward));
}

export function serializeSeasonSummary(season: BattlePassSeason, rewardCount?: number) {
  return {
    id: season.id,
    seasonId: season.seasonId,
    name: season.name,
    startDate: season.startDate,
    endDate: season.endDate ?? null,
    status: season.status,
    baseXpPerLevel: season.baseXpPerLevel,
    xpIncreasePerLevel: season.xpIncreasePerLevel,
    maxLevel: season.maxLevel,
    ...(rewardCount !== undefined ? { rewardCount } : {}),
  };
}
