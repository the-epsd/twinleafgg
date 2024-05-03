import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class AlolanVulpixVSTAR extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    tags: CardTag[];
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = "PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
