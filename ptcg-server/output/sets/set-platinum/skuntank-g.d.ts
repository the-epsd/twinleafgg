import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State } from '../../game';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
export declare class SkuntankG extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly POISON_STRUCTURE_MARKER = "POISON_STRUCTURE_MARKER";
    readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = "DEFENDING_POKEMON_CANNOT_ATTACK_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
