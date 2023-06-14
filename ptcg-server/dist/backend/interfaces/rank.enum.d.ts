export declare enum Rank {
    JUNIOR = "JUNIOR",
    SENIOR = "SENIOR",
    MASTER = "MASTER"
}
export interface RankLevel {
    points: number;
    rank: Rank;
}
export declare const rankLevels: RankLevel[];
