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
    attacks: ({
        name: string;
        cost: CardType[];
        damage: number;
        shredAttack: boolean;
        text: string;
    } | {
        name: string;
        cost: never[];
        damage: number;
        text: string;
        shredAttack?: undefined;
    })[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = "PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER";
    readonly CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER = "CLEAR_PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
