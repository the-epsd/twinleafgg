import { Action, Player, State, PokemonCardList, CardTarget } from '../../game';
import { SimpleBotOptions } from '../simple-bot-options';
export declare type SimpleTacticList = (new (options: SimpleBotOptions) => SimpleTactic)[];
export declare abstract class SimpleTactic {
    protected options: SimpleBotOptions;
    private stateScore;
    constructor(options: SimpleBotOptions);
    abstract useTactic(state: State, player: Player): Action | undefined;
    protected getCardTarget(player: Player, state: State, target: PokemonCardList): CardTarget;
    protected simulateAction(state: State, action: Action): State | undefined;
    private resolvePrompt;
    protected getStateScore(state: State, playerId: number): number;
    protected evaluateAction(state: State, playerId: number, action: Action, passTurnScore?: number): number | undefined;
}
