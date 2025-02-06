import { Marker } from '../state/card-marker';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
import { TrainerCard } from './trainer-card';

export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardType: CardType = CardType.NONE;

  public additionalCardTypes?: CardType[];

  public cardTag: CardTag[] = [];

  public pokemonType: PokemonType = PokemonType.NORMAL;

  public evolvesFrom: string = '';

  public stage: Stage = Stage.BASIC;

  public retreat: CardType[] = [];

  public hp: number = 0;

  public weakness: Weakness[] = [];

  public resistance: Resistance[] = [];

  public powers: Power[] = [];

  public attacks: Attack[] = [];

  public format: Format = Format.NONE;

  public marker = new Marker();

  public movedToActiveThisTurn = false;

  public tools: TrainerCard[] = [];

  public archetype: CardType[] = [];

  public canAttackTwice?: boolean;
}
