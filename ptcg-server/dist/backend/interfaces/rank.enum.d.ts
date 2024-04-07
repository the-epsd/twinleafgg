export declare enum Rank {
    JUNIOR = "JUNIOR",
    SENIOR = "SENIOR",
    ULTRA = "ULTRA",
    MASTER = "MASTER",
    ADMIN = "ADMIN"
}
export interface RankLevel {
    points: number;
    rank: Rank;
}
export declare const rankLevels: RankLevel[];
