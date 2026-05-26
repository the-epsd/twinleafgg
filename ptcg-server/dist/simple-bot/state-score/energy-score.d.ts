import { State } from '../../game';
import { SimpleScore } from './score';
export declare class EnergyScore extends SimpleScore {
    getScore(state: State, playerId: number): number;
    private mergeMissing;
    private getMissingEnergies;
}
