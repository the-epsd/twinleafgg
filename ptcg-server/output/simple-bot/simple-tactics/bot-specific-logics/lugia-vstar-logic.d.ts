import { State, Player, Action } from '../../../game';
import { SimpleTactic } from '../simple-tactics';
export declare class LugiaVStarTactic extends SimpleTactic {
    useTactic(state: State, player: Player): Action | undefined;
    private discardWithUltraBall;
    private discardWithCarmine;
    private discardWithResearch;
    private searchWithUltraBall;
    private searchWithGreatBall;
    private searchWithMesagoza;
}
