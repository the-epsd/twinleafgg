import { CardList } from '../state/card-list';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export declare const OrderCardsPromptType = "Order cards";
export interface OrderCardsOptions {
    allowCancel: boolean;
}
export declare class OrderCardsPrompt extends Prompt<number[]> {
    message: GameMessage;
    cards: CardList;
    readonly type: string;
    options: OrderCardsOptions;
    constructor(playerId: number, message: GameMessage, cards: CardList, options?: Partial<OrderCardsOptions>);
    validate(result: number[] | null): boolean;
}
