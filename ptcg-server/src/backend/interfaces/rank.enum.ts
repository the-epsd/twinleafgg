export enum Rank {
  JUNIOR = 'JUNIOR',
  SENIOR = 'SENIOR',
  ULTRA = 'ULTRA',
  MASTER = 'MASTER',
  ADMIN = 'ADMIN',
  BANNED = 'BANNED',
  POKE = 'POKE',
  GREAT = 'GREAT'
}

export interface RankLevel {
  points: number;
  rank: Rank;
}

export const rankLevels: RankLevel[] = [
  { points: -1, rank: Rank.BANNED },
  { points: 0, rank: Rank.POKE },
  { points: 250, rank: Rank.GREAT },
  { points: 1000, rank: Rank.ULTRA },
  { points: 2500, rank: Rank.MASTER }
];
