import { State, Player, PokemonCardList } from '../../game';
import { SimpleBotOptions, PokemonScores } from '../simple-bot-options';
export declare abstract class SimpleScore {
    protected options: SimpleBotOptions;
    constructor(options: SimpleBotOptions);
    abstract getScore(state: State, playerId: number): number;
    protected getPlayer(state: State, playerId: number): Player;
    protected getPokemonScoreBy(scores: PokemonScores, cardList: PokemonCardList): number;
}
