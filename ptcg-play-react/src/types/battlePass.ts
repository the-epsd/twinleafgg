export type BattlePassRewardType = 'avatar' | 'sleeve' | 'playmat' | 'deck_box' | 'card_art';
export type BattlePassSeasonStatus = 'draft' | 'published' | 'archived';

export interface BattlePassReward {
  id?: number;
  level: number;
  item: string;
  type: BattlePassRewardType | string;
  name: string;
  imageUrl?: string | null;
  sortOrder?: number;
  isPremium?: boolean;
}

export interface BattlePassSeason {
  id: number;
  seasonId: string;
  name: string;
  startDate: string;
  endDate?: string | null;
  status?: BattlePassSeasonStatus;
  baseXpPerLevel?: number;
  xpIncreasePerLevel?: number;
  rewards: BattlePassReward[];
  maxLevel: number;
  rewardCount?: number;
}

export interface BattlePassData {
  ok: boolean;
  season: BattlePassSeason;
}

export interface BattlePassSeasonsData {
  ok: boolean;
  seasons: Array<{
    id: number;
    seasonId: string;
    name: string;
    startDate: string;
    endDate?: string | null;
    status?: BattlePassSeasonStatus;
    maxLevel: number;
    rewardCount?: number;
    baseXpPerLevel?: number;
    xpIncreasePerLevel?: number;
  }>;
}

export interface BattlePassProgress {
  exp: number;
  level: number;
  claimedRewards: number[];
  nextLevelXp: number;
  totalXpForCurrentLevel: number;
  availableRewards: BattlePassReward[];
}

export interface BattlePassProgressData {
  ok: boolean;
  progress: BattlePassProgress;
}

export interface XpGainData {
  xpGained: number;
  previousExp: number;
  newExp: number;
  previousLevel: number;
  newLevel: number;
  leveledUp: boolean;
  xpForNextLevel: number;
  xpForPreviousLevel: number;
  totalXpForPreviousLevel: number;
  totalXpForNewLevel: number;
  seasonName?: string;
}

export interface PendingMatchRewardResponse {
  ok: boolean;
  reward: XpGainData | null;
}

export interface ActiveSeasonResponse {
  ok: boolean;
  seasonId: string | null;
}

export interface AvatarCatalogItem {
  id: number;
  identifier: string;
  name: string;
  fileName: string;
  isDefault: boolean;
  sortOrder: number;
  imageUrl: string;
}

export interface SleeveCatalogItem {
  id: number;
  identifier: string;
  name: string;
  imagePath: string;
  isDefault: boolean;
  requiresUnlock: boolean;
  sortOrder: number;
  imageUrl: string;
}
