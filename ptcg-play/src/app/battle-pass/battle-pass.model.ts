export interface BattlePassReward {
  level: number;
  item: string;
  type: 'avatar' | 'card_back' | 'playmat' | 'marker';
  name: string;
  isPremium: boolean;
}

export interface BattlePassSeason {
  id: number;
  seasonId: string;
  name: string;
  startDate: string;
  rewards: BattlePassReward[];
  maxLevel: number;
}

export interface BattlePassData {
  ok: boolean;
  season: BattlePassSeason;
}

export interface BattlePassSeasonsData {
  ok: boolean;
  seasons: Array<{ id: number; seasonId: string; name: string; startDate: string; maxLevel: number }>;
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