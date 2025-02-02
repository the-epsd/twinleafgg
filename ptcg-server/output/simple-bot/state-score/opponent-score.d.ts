import { State } from '../../game';
import { SimpleScore } from './score';
export declare class OpponentScore extends SimpleScore {
    getScore(state: State, playerId: number): number;
}
