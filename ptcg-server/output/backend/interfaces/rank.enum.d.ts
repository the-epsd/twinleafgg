export declare enum Rank {
    JUNIOR = "JUNIOR",
    SENIOR = "SENIOR",
    ULTRA = "ULTRA",
    MASTER = "MASTER",
    ADMIN = "ADMIN",
    BANNED = "BANNED",
    POKE = "POKE",
    GREAT = "GREAT"
}
export interface RankLevel {
    points: number;
    rank: Rank;
}
export declare const rankLevels: RankLevel[];
