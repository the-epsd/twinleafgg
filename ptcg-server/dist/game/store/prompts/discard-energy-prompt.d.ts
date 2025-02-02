import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { FilterType } from './choose-cards-prompt';
export declare const DiscardEnergyPromptType = "Discard energy";
export declare type DiscardEnergyResultType = {
    from: CardTarget;
    to: CardTarget;
    index: number;
}[];
export interface DiscardEnergyTransfer {
    from: CardTarget;
    to: CardTarget;
    card: Card;
}
export interface DiscardEnergyOptions {
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
export declare class DiscardEnergyPrompt extends Prompt<DiscardEnergyTransfer[]> {
    message: GameMessage;
    playerType: PlayerType;
    slots: SlotType[];
    filter: FilterType;
    readonly type: string;
    options: DiscardEnergyOptions;
    constructor(playerId: number, message: GameMessage, playerType: PlayerType, slots: SlotType[], filter: FilterType, options?: Partial<DiscardEnergyOptions>);
    decode(result: DiscardEnergyResultType | null, state: State): DiscardEnergyTransfer[] | null;
    validate(result: DiscardEnergyTransfer[] | null): boolean;
}
