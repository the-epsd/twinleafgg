import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { State } from '../state/state';
import { Attack } from '../card/pokemon-types';
import { Card } from '../card/card';
export declare const ChooseAttackPromptType = "Choose attack";
export interface ChooseAttackOptions {
    allowCancel: boolean;
    blockedMessage: GameMessage;
    blocked: {
        index: number;
        attack: string;
    }[];
}
export declare type ChooseAttackResultType = {
    index: number;
    attack: string;
};
export declare class ChooseAttackPrompt extends Prompt<Attack> {
    message: GameMessage;
    cards: Card[];
    readonly type: string;
    options: ChooseAttackOptions;
    constructor(playerId: number, message: GameMessage, cards: Card[], options?: Partial<ChooseAttackOptions>);
    decode(result: ChooseAttackResultType | null, state: State): Attack | null;
    validate(result: Attack | null): boolean;
}
