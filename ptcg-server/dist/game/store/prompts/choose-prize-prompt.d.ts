import { CardList } from '../state/card-list';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { GameMessage } from '../../game-message';
export declare const ChoosePrizePromptType = "Choose prize";
export interface ChoosePrizeOptions {
    isSecret: boolean;
    count: number;
    max: number;
    blocked: number[];
    useOpponentPrizes: boolean;
    allowCancel: boolean;
}
export declare class ChoosePrizePrompt extends Prompt<CardList[]> {
    message: GameMessage;
    readonly type: string;
    options: ChoosePrizeOptions;
    constructor(playerId: number, message: GameMessage, options?: Partial<ChoosePrizeOptions>);
    decode(result: number[] | null, state: State): CardList[] | null;
    validate(result: CardList[] | null): boolean;
}
