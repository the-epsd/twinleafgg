import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
export declare abstract class PokemonCard extends Card {
    superType: SuperType;
    cardType: CardType;
    pokemonType: PokemonType;
    evolvesFrom: string;
    stage: Stage;
    retreat: CardType[];
    hp: number;
    weakness: Weakness[];
    resistance: Resistance[];
    powers: Power[];
    attacks: Attack[];
}
