export interface BattlePassReward {
  level: number;
  item: string;
  type: 'avatar' | 'card_back' | 'playmat' | 'marker' | 'booster';
  name: string;
  isPremium: boolean;
}

export interface BattlePassSeason {
  id: number;
  seasonId: string;
  name: string;
  startDate: string;
  endDate: string;
  rewards: BattlePassReward[];
  maxLevel: number;
}

export interface BattlePassData {
  ok: boolean;
  season: BattlePassSeason;
  isPremium: boolean;
}

export interface BattlePassProgress {
  exp: number;
  level: number;
  claimedRewards: number[];
  nextLevelXp: number;
  totalXpForCurrentLevel: number;
  isPremium: boolean;
  availableRewards: BattlePassReward[];
}

export interface BattlePassProgressData {
  ok: boolean;
  progress: BattlePassProgress;
} 