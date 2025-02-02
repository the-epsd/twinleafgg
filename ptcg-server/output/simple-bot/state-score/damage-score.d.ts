import { State } from '../../game';
import { SimpleScore } from './score';
export declare class DamageScore extends SimpleScore {
    getScore(state: State, playerId: number): number;
}
