import { Marker } from '../state/card-marker';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
import { TrainerCard } from './trainer-card';
export declare abstract class PokemonCard extends Card {
    superType: SuperType;
    cardType: CardType;
    additionalCardTypes?: CardType[];
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
    marker: Marker;
    movedToActiveThisTurn: boolean;
    tools: TrainerCard[];
    archetype: CardType[];
    attacksThisTurn: number;
    maxAttacksThisTurn: number;
    allowSubsequentAttackChoice: boolean;
}
