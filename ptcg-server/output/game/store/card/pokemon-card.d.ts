import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
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
    format: Format[];
    powers: Power[];
    attacks: Attack[];
}
