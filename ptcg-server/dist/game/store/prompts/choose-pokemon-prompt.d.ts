import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { GameMessage } from '../../game-message';
export declare const ChoosePokemonPromptType = "Choose pokemon";
export interface ChoosePokemonOptions {
    min: number;
    max: number;
    allowCancel: boolean;
    blocked: CardTarget[];
}
export declare class ChoosePokemonPrompt extends Prompt<PokemonCardList[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    readonly type: string;
    options: ChoosePokemonOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], options?: Partial<ChoosePokemonOptions>);
    decode(result: CardTarget[] | null, state: State): PokemonCardList[] | null;
    validate(result: PokemonCardList[] | null, state: State): boolean;
}
