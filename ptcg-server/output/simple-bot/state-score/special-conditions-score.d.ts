import { State } from '../../game';
import { SimpleScore } from './score';
export declare class SpecialConditionsScore extends SimpleScore {
    getScore(state: State, playerId: number): number;
    private getScoreForPlayer;
}
