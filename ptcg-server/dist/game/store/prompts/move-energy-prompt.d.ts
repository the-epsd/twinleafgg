import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { FilterType } from './choose-cards-prompt';
export declare const MoveEnergyPromptType = "Move energy";
export declare type MoveEnergyResultType = {
    from: CardTarget;
    to: CardTarget;
    index: number;
}[];
export interface CardTransfer {
    from: CardTarget;
    to: CardTarget;
    card: Card;
}
export interface MoveEnergyOptions {
    allowCancel: boolean;
    min: number;
    max: number | undefined;
    blockedFrom: CardTarget[];
    blockedTo: CardTarget[];
    blockedMap: {
        source: CardTarget;
        blocked: number[];
    }[];
}
export declare class MoveEnergyPrompt extends Prompt<CardTransfer[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    filter: FilterType;
    readonly type: string;
    options: MoveEnergyOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], filter: FilterType, options?: Partial<MoveEnergyOptions>);
    decode(result: MoveEnergyResultType | null, state: State): CardTransfer[] | null;
    validate(result: CardTransfer[] | null): boolean;
}
