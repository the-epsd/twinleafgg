import { PokemonCard, Stage, CardType, StoreLike, State, CardTag, PowerType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
export declare class TeamRocketsMewtwoex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.DARK;
    }[];
    resistance: {
        type: CardType.FIGHTING;
        value: number;
    }[];
    retreat: CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (CardType.PSYCHIC | CardType.COLORLESS)[];
        damage: number;
        damageCalculation: string;
        text: string;
    }[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
    private isTeamRocketPokemon;
}
