import { Action, Player, State } from '../../game';
import { SimpleTactic } from './simple-tactics';
export declare class RetreatTactic extends SimpleTactic {
    useTactic(state: State, player: Player): Action | undefined;
}
