import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format, Archetype } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
export declare abstract class PokemonCard extends Card {
    superType: SuperType;
    cardType: CardType;
    cardTag: CardTag[];
    pokemonType: PokemonType;
    evolvesFrom: string;
    stage: Stage;
    retreat: CardType[];
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    powers: Power[];
    attacks: Attack[];
    format: Format;
    archetype: Archetype;
    movedToActiveThisTurn: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
