import { GameMessage } from '../../game-message';
import { Card } from '../card/card';
import { CardType } from '../card/card-types';
import { EnergyCard } from '../card/energy-card';
import { PokemonCard } from '../card/pokemon-card';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { Player } from '../state/player';
import { Prompt } from './prompt';
export declare const ChooseCardsPromptType = "Choose cards";
export interface ChooseCardsOptions {
    min: number;
    max: number;
    allowCancel: boolean;
    blocked: number[];
    isSecret: boolean;
    differentTypes: boolean;
    maxPokemons: number | undefined;
    maxBasicEnergies: number | undefined;
    maxEnergies: number | undefined;
    maxTrainers: number | undefined;
    maxTools: number | undefined;
    maxStadiums: number | undefined;
    maxSupporters: number | undefined;
    maxSpecialEnergies: number | undefined;
    maxItems: number | undefined;
    allowDifferentSuperTypes: boolean;
}
export declare type FilterType = Partial<PokemonCard | TrainerCard | EnergyCard>;
export declare class ChooseCardsPrompt extends Prompt<Card[]> {
    message: GameMessage;
    cards: CardList;
    filter: FilterType;
    readonly type: string;
    options: ChooseCardsOptions;
    private blockedCardNames;
    player: Player;
    constructor(player: Player, message: GameMessage, cards: CardList, filter: FilterType, options?: Partial<ChooseCardsOptions>);
    decode(result: number[] | null): Card[] | null;
    validate(result: Card[] | null): boolean;
    static getCardType(card: Card): CardType;
    private matchesFilter;
}
