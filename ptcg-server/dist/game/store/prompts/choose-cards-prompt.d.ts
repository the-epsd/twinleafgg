import { Card } from '../card/card';
import { CardList } from '../state/card-list';
import { EnergyCard } from '../card/energy-card';
import { GameMessage } from '../../game-message';
import { Prompt } from './prompt';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { CardType } from '../card/card-types';
export declare const ChooseCardsPromptType = "Choose cards";
export interface ChooseCardsOptions {
    min: number;
    max: number;
    allowCancel: boolean;
    blocked: number[];
    isSecret: boolean;
    differentTypes: boolean;
    maxPokemons: number | undefined;
    maxEnergies: number | undefined;
    maxTrainers: number | undefined;
}
export declare type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;
export declare class ChooseCardsPrompt extends Prompt<Card[]> {
    message: GameMessage;
    cards: CardList;
    filter: FilterType;
    readonly type: string;
    options: ChooseCardsOptions;
    constructor(playerId: number, message: GameMessage, cards: CardList, filter: FilterType, options?: Partial<ChooseCardsOptions>);
    decode(result: number[] | null): Card[] | null;
    validate(result: Card[] | null): boolean;
    static getCardType(card: Card): CardType;
    private matchesFilter;
}
