import { State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
export declare class Delcatty extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly POWER_CIRCULATION_MARKER = "POWER_CIRCULATION_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: AttackEffect): State;
}
