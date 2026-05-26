import { State, PokemonCardList, Card } from '../../game';
import { SimpleScore } from './score';
import { SimpleBotOptions } from '../simple-bot-options';
export declare class StateScore extends SimpleScore {
    protected options: SimpleBotOptions;
    private handScore;
    private opponentScore;
    private playerScore;
    private specialConditionsScore;
    private activeScore;
    private benchScore;
    private energyScore;
    private damageScore;
    private toolsScore;
    constructor(options: SimpleBotOptions);
    getScore(state: State, playerId: number): number;
    getCardScore(state: State, playerId: number, card: Card): number;
    getPokemonScore(cardList: PokemonCardList): number;
}
