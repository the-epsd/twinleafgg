import { Effect } from './effect';
import { Player } from '../state/player';
import { Card } from '../card/card';

export enum GamePhaseEffects {
  BEGIN_TURN_EFFECT = 'BEGIN_TURN_EFFECT',
  END_TURN_EFFECT = 'END_TURN_EFFECT',
  WHO_BEGINS_EFFECT = 'WHO_BEGINS_EFFECT',
  BETWEEN_TURNS_EFFECT = 'BETWEEN_TURNS_EFFECT',
  CHOOSE_STARTING_POKEMON_EFFECT = 'CHOOSE_STARTING_POKEMON_EFFECT',
  DREW_TOPDECK_EFFECT = 'DREW_TOPDECK_EFFECT'
}

export class BeginTurnEffect implements Effect {
  readonly type: string = GamePhaseEffects.BEGIN_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class DrewTopdeckEffect implements Effect {
  readonly type: string = GamePhaseEffects.DREW_TOPDECK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public handCard: Card;

  constructor(player: Player, handCard: Card) {
    this.player = player;
    this.handCard = handCard;
  }
}

export class ChooseStartingPokemonEffect implements Effect {
  readonly type: string = GamePhaseEffects.CHOOSE_STARTING_POKEMON_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class EndTurnEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;

  constructor(player: Player) {
    this.player = player;
  }
}

export class WhoBeginsEffect implements Effect {
  readonly type: string = GamePhaseEffects.END_TURN_EFFECT;
  public preventDefault = false;
  public player: Player | undefined;

  constructor() { }
}

export class BetweenTurnsEffect implements Effect {
  readonly type: string = GamePhaseEffects.BETWEEN_TURNS_EFFECT;
  public preventDefault = false;
  public player: Player;
  public poisonDamage: number;
  public flipsForSleep: number | undefined;
  public burnDamage: number;
  public burnFlipResult: boolean | undefined;
  public asleepFlipResult: boolean | undefined;

  constructor(player: Player) {
    this.player = player;
    this.poisonDamage = player.active.poisonDamage;
    this.burnDamage = player.active.burnDamage;
    this.flipsForSleep = undefined;
    this.burnFlipResult = undefined;
    this.asleepFlipResult = undefined;
  }
}
