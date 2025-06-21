import { Attack, Power } from '../card/pokemon-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Card } from '../card/card';
import { CardTarget } from '../actions/play-card-action';
import { TrainerCard } from '../card/trainer-card';
import { CardList } from '../state/card-list';
import { EnergyCard } from '../card/energy-card';

export enum GameEffects {
  RETREAT_EFFECT = 'RETREAT_EFFECT',
  USE_ATTACK_EFFECT = 'USE_ATTACK_EFFECT',
  USE_STADIUM_EFFECT = 'USE_STADIUM_EFFECT',
  USE_POWER_EFFECT = 'USE_POWER_EFFECT',
  POWER_EFFECT = 'POWER_EFFECT',
  ATTACK_EFFECT = 'ATTACK_EFFECT',
  KNOCK_OUT_EFFECT = 'KNOCK_OUT_EFFECT',
  HEAL_EFFECT = 'HEAL_EFFECT',
  EVOLVE_EFFECT = 'EVOLVE_EFFECT',
  DRAW_PRIZES_EFFECT = 'DRAW_PRIZES_EFFECT',
  MOVE_CARDS_EFFECT = 'MOVE_CARDS_EFFECT',
  EFFECT_OF_ABILITY_EFFECT = 'EFFECT_OF_ABILITY_EFFECT',
  SPECIAL_ENERGY_EFFECT = 'SPECIAL_ENERGY_EFFECT'
}

export class RetreatEffect implements Effect {
  readonly type: string = GameEffects.RETREAT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public benchIndex: number;
  public ignoreStatusConditions = false;
  public moveRetreatCostTo: CardList;

  constructor(player: Player, benchIndex: number) {
    this.player = player;
    this.benchIndex = benchIndex;
    this.moveRetreatCostTo = player.discard;
  }
}
export class UsePowerEffect implements Effect {
  readonly type: string = GameEffects.USE_POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: PokemonCard;
  public target: CardTarget;

  constructor(player: Player, power: Power, card: PokemonCard, target: CardTarget) {
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
}

export class UseTrainerPowerEffect implements Effect {
  readonly type: string = GameEffects.USE_POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: TrainerCard;
  public target: CardTarget;

  constructor(player: Player, power: Power, card: TrainerCard, target: CardTarget) {
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
}

export class UseEnergyPowerEffect implements Effect {
  readonly type: string = GameEffects.USE_POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: EnergyCard;
  public target: CardTarget;

  constructor(player: Player, power: Power, card: EnergyCard, target: CardTarget) {
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
}

export class PowerEffect implements Effect {
  readonly type: string = GameEffects.POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: PokemonCard;
  public target?: PokemonCardList;
  static DISCARD_CARD_EFFECT: string;

  constructor(player: Player, power: Power, card: PokemonCard, target?: PokemonCardList) {
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
}

export class TrainerPowerEffect implements Effect {
  readonly type: string = GameEffects.POWER_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: TrainerCard;

  constructor(player: Player, power: Power, card: TrainerCard) {
    this.player = player;
    this.power = power;
    this.card = card;
  }
}

export class UseAttackEffect implements Effect {
  readonly type: string = GameEffects.USE_ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attack: Attack;
  public source: PokemonCardList;
  constructor(player: Player, attack: Attack) {
    this.player = player;
    this.attack = attack;
    this.source = player.active;
  }
}

export class UseStadiumEffect implements Effect {
  readonly type: string = GameEffects.USE_STADIUM_EFFECT;
  public preventDefault = false;
  public player: Player;
  public stadium: Card;

  constructor(player: Player, stadium: Card) {
    this.player = player;
    this.stadium = stadium;
  }
}

export class AttackEffect implements Effect {
  readonly type: string = GameEffects.ATTACK_EFFECT;
  public preventDefault = false;
  public player: Player;
  public opponent: Player;
  public attack: Attack;
  public damage: number;
  public ignoreWeakness = false;
  public ignoreResistance = false;
  public source: PokemonCardList;
  public invisibleTentacles?: boolean = false;
  target: any;

  constructor(player: Player, opponent: Player, attack: Attack) {
    this.player = player;
    this.opponent = opponent;
    this.attack = attack;
    this.damage = attack.damage;
    this.source = player.active;
  }
}

// how many prizes when target Pokemon is KO
export class KnockOutEffect implements Effect {
  readonly type: string = GameEffects.KNOCK_OUT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public prizeCount: number;
  public prizeDestination?: CardList;
  public isLostCity: boolean = false;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    this.prizeCount = 1;
  }
}

// how many prizes when target Pokemon is KO
export class KnockOutAttackEffect implements Effect {
  readonly type: string = GameEffects.KNOCK_OUT_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public attack: Attack;
  public prizeCount: number;

  constructor(player: Player, target: PokemonCardList, attack: Attack) {
    this.player = player;
    this.target = target;
    this.attack = attack;
    this.prizeCount = 1;
  }
}

export class HealEffect implements Effect {
  readonly type: string = GameEffects.HEAL_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public damage: number;

  constructor(player: Player, target: PokemonCardList, damage: number) {
    this.player = player;
    this.target = target;
    this.damage = damage;
  }
}

export class EvolveEffect implements Effect {
  readonly type: string = GameEffects.EVOLVE_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public pokemonCard: PokemonCard;
  public darkestImpulseSV?: boolean;

  constructor(player: Player, target: PokemonCardList, pokemonCard: PokemonCard) {
    this.player = player;
    this.target = target;
    this.pokemonCard = pokemonCard;
    this.target.triggerAnimation = true;
  }
}

export class DrawPrizesEffect implements Effect {
  readonly type: string = GameEffects.DRAW_PRIZES_EFFECT;
  public preventDefault = false;
  public player: Player;
  public prizes: CardList[];
  public destination: CardList;

  constructor(player: Player, prizes: CardList[], destination: CardList) {
    this.player = player;
    this.prizes = prizes;
    this.destination = destination;
  }
}

export class MoveCardsEffect implements Effect {
  readonly type: string = GameEffects.MOVE_CARDS_EFFECT;
  public preventDefault = false;
  public source: CardList | PokemonCardList;
  public destination: CardList | PokemonCardList;
  public cards?: Card[];
  public count?: number;
  public toTop?: boolean;
  public toBottom?: boolean;
  public skipCleanup?: boolean;
  public sourceCard?: Card;

  constructor(
    source: CardList | PokemonCardList,
    destination: CardList | PokemonCardList,
    options: {
      cards?: Card[],
      count?: number,
      toTop?: boolean,
      toBottom?: boolean,
      skipCleanup?: boolean,
      sourceCard?: Card
    } = {}
  ) {
    this.source = source;
    this.destination = destination;
    this.cards = options.cards;
    this.count = options.count;
    this.toTop = options.toTop;
    this.toBottom = options.toBottom;
    this.skipCleanup = options.skipCleanup;
    this.sourceCard = options.sourceCard;
  }
}

export class EffectOfAbilityEffect implements Effect {
  readonly type: string = GameEffects.EFFECT_OF_ABILITY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public power: Power;
  public card: PokemonCard;
  public target?: PokemonCardList;

  constructor(
    player: Player,
    power: Power,
    card: PokemonCard,
    target?: PokemonCardList
  ) {
    this.player = player;
    this.power = power;
    this.card = card;
    this.target = target;
  }
}

export class SpecialEnergyEffect implements Effect {
  readonly type: string = GameEffects.SPECIAL_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public card: EnergyCard;
  public attachedTo: PokemonCardList;
  public exemptFromOpponentsSpecialEnergyBlockingAbility: boolean;

  constructor(
    player: Player,
    card: EnergyCard,
    attachedTo: PokemonCardList,
    exemptFromOpponentsSpecialEnergyBlockingAbility: boolean = false
  ) {
    this.player = player;
    this.card = card;
    this.attachedTo = attachedTo;
    this.exemptFromOpponentsSpecialEnergyBlockingAbility = exemptFromOpponentsSpecialEnergyBlockingAbility;
  }
}

export { Effect };
