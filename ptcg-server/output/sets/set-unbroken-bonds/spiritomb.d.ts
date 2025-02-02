import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class Spiritomb extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly BUILDING_SPITE_MARKER = "BUILDING_SPITE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State;
}
