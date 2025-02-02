import { User, Match } from '../../storage';
import { State } from '../store/state/state';
export declare class RankingCalculator {
    constructor();
    calculateMatch(match: Match, state: State): User[];
    private getRankingDiff;
    private getRankMultiplier;
    private getRankPoints;
    decreaseRanking(): Promise<User[]>;
}
