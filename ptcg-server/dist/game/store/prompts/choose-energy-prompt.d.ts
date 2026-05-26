import { Card } from '../card/card';
import { CardType } from '../card/card-types';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
export declare const ChooseEnergyPromptType = "Choose energy";
export interface ChooseEnergyOptions {
    allowCancel: boolean;
}
export declare type EnergyMap = {
    card: Card;
    provides: CardType[];
};
export declare class ChooseEnergyPrompt extends Prompt<EnergyMap[]> {
    message: GameMessage;
    energy: EnergyMap[];
    cost: CardType[];
    readonly type: string;
    options: ChooseEnergyOptions;
    constructor(playerId: number, message: GameMessage, energy: EnergyMap[], cost: CardType[], options?: Partial<ChooseEnergyOptions>);
    decode(result: number[] | null): EnergyMap[] | null;
    validate(result: EnergyMap[] | null): boolean;
    private getCostThatCanBePaid;
}
