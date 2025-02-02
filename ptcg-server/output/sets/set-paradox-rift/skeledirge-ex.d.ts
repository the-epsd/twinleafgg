import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class SkeledirgeEX extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    weakness: {
        type: CardType.FIRE;
    }[];
    resistance: {
        type: CardType.GRASS;
        value: number;
    }[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        shredAttack: boolean;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    readonly INCENDIARY_SONG_MARKER = "INCENDIARY_SONG_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
