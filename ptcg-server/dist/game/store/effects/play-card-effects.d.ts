import { Effect } from './effect';
import { EnergyCard } from '../card/energy-card';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { Card } from '../card/card';
export declare enum PlayCardEffects {
    ATTACH_ENERGY_EFFECT = "ATTACH_ENERGY_EFFECT",
    PLAY_POKEMON_EFFECT = "PLAY_POKEMON_EFFECT",
    PLAY_SUPPORTER_EFFECT = "PLAY_SUPPORTER_EFFECT",
    PLAY_STADIUM_EFFECT = "PLAY_STADIUM_EFFECT",
    PLAY_POKEMON_TOOL_EFFECT = "PLAY_POKEMON_TOOL_EFFECT",
    PLAY_ITEM_EFFECT = "PLAY_ITEM_EFFECT",
    TRAINER_EFFECT = "TRAINER_EFFECT",
    ENERGY_EFFECT = "ENERGY_EFFECT",
    TOOL_EFFECT = "TOOL_EFFECT",
    SUPPORTER_EFFECT = "SUPPORTER_EFFECT",
    COIN_FLIP_EFFECT = "COIN_FLIP_EFFECT",
    TRAINER_CARD_TO_DECK_EFFECT = "TRAINER_CARD_TO_DECK_EFFECT",
    DISCARD_TO_HAND_EFFECT = "DISCARD_TO_HAND_EFFECT"
}
export declare class AttachEnergyEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    energyCard: EnergyCard;
    target: PokemonCardList;
    constructor(player: Player, energyCard: EnergyCard, target: PokemonCardList);
}
export declare class PlayPokemonEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    pokemonCard: PokemonCard;
    target: PokemonCardList;
    constructor(player: Player, pokemonCard: PokemonCard, target: PokemonCardList);
}
export declare class PlaySupporterEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    trainerCard: TrainerCard;
    target: CardList | undefined;
    constructor(player: Player, trainerCard: TrainerCard, target?: CardList);
}
export declare class PlayStadiumEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    trainerCard: TrainerCard;
    constructor(player: Player, trainerCard: TrainerCard);
}
export declare class AttachPokemonToolEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    trainerCard: TrainerCard;
    target: PokemonCardList;
    constructor(player: Player, trainerCard: TrainerCard, target: PokemonCardList);
}
export declare class PlayItemEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    trainerCard: TrainerCard;
    target: CardList | undefined;
    constructor(player: Player, trainerCard: TrainerCard, target?: CardList);
}
export declare class TrainerEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    trainerCard: TrainerCard;
    target: CardList | undefined;
    constructor(player: Player, trainerCard: TrainerCard, target?: CardList);
}
export declare class EnergyEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: EnergyCard;
    constructor(player: Player, card: EnergyCard);
}
export declare class ToolEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: TrainerCard;
    constructor(player: Player, card: TrainerCard);
}
export declare class SupporterEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: TrainerCard;
    target: CardList | undefined;
    constructor(player: Player, card: TrainerCard);
}
export declare class CoinFlipEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    constructor(player: Player);
}
export declare class TrainerToDeckEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: TrainerCard;
    constructor(player: Player, card: TrainerCard);
}
export declare class DiscardToHandEffect implements Effect {
    readonly type: string;
    preventDefault: boolean;
    player: Player;
    card: Card;
    constructor(player: Player, card: Card);
}
