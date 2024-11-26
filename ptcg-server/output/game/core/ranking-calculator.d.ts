import { User, Match } from '../../storage';
export declare class RankingCalculator {
    constructor();
    calculateMatch(match: Match): User[];
    private getRankingDiff;
    private getRankMultiplier;
    private getRankPoints;
    decreaseRanking(): Promise<User[]>;
}
