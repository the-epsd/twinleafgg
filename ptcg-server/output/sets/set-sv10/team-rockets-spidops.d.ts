import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class TeamRocketsSpidops extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType;
    }[];
    retreat: CardType[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: CardType[];
        damage: number;
        text: string;
    }[];
    tags: CardTag[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    readonly CHARGE_UP_MARKER = "CHARGE_UP_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
