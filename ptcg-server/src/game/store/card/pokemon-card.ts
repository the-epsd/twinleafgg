import { Marker } from '../state/card-marker';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
import { TrainerCard } from './trainer-card';

export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardType: CardType = CardType.COLORLESS;

  public additionalCardTypes?: CardType[];

  public cardTag: CardTag[] = [];

  public pokemonType: PokemonType = PokemonType.NORMAL;

  public evolvesFrom: string = '';

  public evolvesTo: string[] = [];

  public evolvesToStage: Stage[] = [];

  public evolvesFromBase: string[] = [];

  public legacyFullName?: string;

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

  public maxTools: number = 1;

  public archetype: CardType[] = [];

  public canAttackTwice?: boolean;

  public damageTakenLastTurn?: number = 0;

  public wasMovedToActiveThisTurn?(player: any): boolean {
    return player.movedToActiveThisTurn.includes(this.id);
  }
}
