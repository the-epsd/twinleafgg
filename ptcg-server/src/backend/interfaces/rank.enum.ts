export enum Rank {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  ULTRA = 'ULTRA',
  MASTER = 'MASTER',
  ADMIN = 'ADMIN'
}

export interface RankLevel {
  points: number;
  rank: Rank;
}

export const rankLevels: RankLevel[] = [
  { points: 0, rank: Rank.JUNIOR },
  { points: 500, rank: Rank.SENIOR },
  { points: 1000, rank: Rank.ULTRA },
  { points: 2500, rank: Rank.MASTER }
];
