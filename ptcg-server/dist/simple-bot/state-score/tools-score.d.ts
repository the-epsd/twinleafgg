import { State } from '../../game';
import { SimpleScore } from './score';
export declare class ToolsScore extends SimpleScore {
    getScore(state: State, playerId: number): number;
}
