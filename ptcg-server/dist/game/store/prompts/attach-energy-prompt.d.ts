import { Card } from '../card/card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PlayerType, SlotType, CardTarget } from '../actions/play-card-action';
import { State } from '../state/state';
import { CardList } from '../state/card-list';
import { FilterType } from './choose-cards-prompt';
import { CardType } from '../card/card-types';
export declare const AttachEnergyPromptType = "Attach energy";
export interface AttachEnergyOptions {
    allowCancel: boolean;
    min: number;
    max: number;
    blocked: number[];
    blockedTo: CardTarget[];
    differentTypes: boolean;
    sameTarget: boolean;
    differentTargets: boolean;
    validCardTypes?: CardType[];
    maxPerType?: number;
}
export declare type AttachEnergyResultType = {
    to: CardTarget;
    index: number;
}[];
export interface CardAssign {
    to: CardTarget;
    card: Card;
}
export declare class AttachEnergyPrompt extends Prompt<CardAssign[]> {
    message: GameMessage;
    cardList: CardList;
    playerType: PlayerType;
    slots: SlotType[];
    filter: FilterType;
    readonly type: string;
    options: AttachEnergyOptions;
    constructor(playerId: number, message: GameMessage, cardList: CardList, playerType: PlayerType, slots: SlotType[], filter: FilterType, options?: Partial<AttachEnergyOptions>);
    decode(result: AttachEnergyResultType | null, state: State): CardAssign[] | null;
    validate(result: CardAssign[] | null): boolean;
    private getCardType;
}
