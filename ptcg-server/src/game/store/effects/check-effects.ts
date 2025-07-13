import { CardType, EnergyType, SpecialCondition } from '../card/card-types';
import { Effect } from './effect';
import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { Resistance, Weakness, Attack, Power } from '../card/pokemon-types';
import { EnergyMap } from '../prompts/choose-energy-prompt';
import { TrainerCard } from '../card/trainer-card';
import { Card } from '../card/card';
import { CardList } from '../state/card-list';

export enum CheckEffects {
  CHECK_HP_EFFECT = 'CHECK_HP_EFFECT',
  CHECK_PRIZES_COUNT_EFFECT = 'CHECK_PRIZE_COUNT_EFFECT',
  CHECK_POKEMON_STATS_EFFECT = 'CHECK_POKEMON_STATS_EFFECT',
  CHECK_POKEMON_POWERS_EFFECT = 'CHECK_POKEMON_POWERS_EFFECT',
  CHECK_POKEMON_ATTACKS_EFFECT = 'CHECK_POKEMON_ATTACKS_EFFECT',
  CHECK_POKEMON_TYPE_EFFECT = 'CHECK_POKEMON_TYPE_EFFECT',
  CHECK_RETREAT_COST_EFFECT = 'CHECK_RETREAT_COST_EFFECT',
  CHECK_ATTACK_COST_EFFECT = 'CHECK_ATTACK_COST_EFFECT',
  CHECK_ENOUGH_ENERGY_EFFECT = 'CHECK_ENOUGH_ENERGY_EFFECT',
  CHECK_POKEMON_PLAYED_TURN_EFFECT = 'CHECK_POKEMON_PLAYED_TURN_EFFECT',
  CHECK_TABLE_STATE_EFFECT = 'CHECK_TABLE_STATE_EFFECT',
  ADD_SPECIAL_CONDITIONS_EFFECT = 'ADD_SPECIAL_CONDITIONS_EFFECT',
  CHECK_PRIZES_DESTINATION_EFFECT = 'CHECK_PRIZES_DESTINATION_EFFECT'
}

export class CheckPokemonPowersEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_POWERS_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public powers: Power[];

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.powers = pokemonCard ? pokemonCard.powers : [];
  }
}

export class CheckPokemonAttacksEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_ATTACKS_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attacks: Attack[];

  constructor(player: Player) {
    this.player = player;
    const tool = player.active.tools[0];

    if (!!tool && (tool as TrainerCard).attacks.length > 0) {
      this.attacks = [...(tool as TrainerCard).attacks];
    } else {
      this.attacks = [];
    }
  }
}

export class CheckHpEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_HP_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public hp: number;
  public hpBoosted?: boolean;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.hp = pokemonCard ? pokemonCard.hp : 0;
  }
}

export class CheckPokemonPlayedTurnEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_PLAYED_TURN_EFFECT;
  public preventDefault = false;
  public player: Player;
  public target: PokemonCardList;
  public pokemonPlayedTurn: number;

  constructor(player: Player, target: PokemonCardList) {
    this.player = player;
    this.target = target;
    this.pokemonPlayedTurn = target.pokemonPlayedTurn;
  }
}

export class CheckPokemonStatsEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_STATS_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public weakness: Weakness[];
  public resistance: Resistance[];

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.weakness = pokemonCard ? [...pokemonCard.weakness] : [];
    this.resistance = pokemonCard ? [...pokemonCard.resistance] : [];
  }
}

export class CheckPokemonTypeEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_POKEMON_TYPE_EFFECT;
  public preventDefault = false;
  public target: PokemonCardList;
  public cardTypes: CardType[];

  constructor(target: PokemonCardList) {
    this.target = target;
    const pokemonCard = target.getPokemonCard();
    this.cardTypes = pokemonCard ? [pokemonCard.cardType] : [];
    if (pokemonCard && pokemonCard.additionalCardTypes) {
      this.cardTypes = [...this.cardTypes, ...pokemonCard.additionalCardTypes];
    }
  }
}


export class CheckRetreatCostEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_RETREAT_COST_EFFECT;
  public preventDefault = false;
  public player: Player;
  public cost: CardType[];

  constructor(player: Player) {
    this.player = player;
    const pokemonCard = player.active.getPokemonCard();
    this.cost = pokemonCard !== undefined ? [...pokemonCard.retreat] : [];
  }
}

export class CheckAttackCostEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_ATTACK_COST_EFFECT;
  public preventDefault = false;
  public player: Player;
  public attack: Attack;
  public cost: CardType[];

  constructor(player: Player, attack: Attack) {
    this.player = player;
    this.attack = attack;
    this.cost = [...attack.cost];
  }
}

export class CheckProvidedEnergyEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_ENOUGH_ENERGY_EFFECT;
  public preventDefault = false;
  public player: Player;
  public source: PokemonCardList;
  private _energyMap: EnergyMap[] = [];
  public totalProvidedTypes: EnergyMap[] = [];
  public specialEnergiesProvideColorless: boolean = false;

  constructor(player: Player, source?: PokemonCardList) {
    this.player = player;
    this.source = source === undefined ? player.active : source;
  }

  // Apply effects such as Temple of Sinnoh and Spectral Breach
  public get energyMap(): EnergyMap[] {
    if (this.specialEnergiesProvideColorless) {
      this._energyMap.forEach((value) => {
        if (value.card.energyType === EnergyType.SPECIAL) {
          value.provides = [CardType.COLORLESS];
        }
      });
    }
    return this._energyMap;
  }
}

export class CheckTableStateEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_TABLE_STATE_EFFECT;
  public preventDefault = false;
  public benchSizes: number[];
  public player!: Player;

  constructor(benchSizes: number[]) {
    this.benchSizes = benchSizes;
  }
}

export class AddSpecialConditionsPowerEffect implements Effect {
  readonly type: string = CheckEffects.ADD_SPECIAL_CONDITIONS_EFFECT;
  public preventDefault = false;
  public poisonDamage?: number;
  public burnDamage?: number;
  public sleepFlips?: number;
  public specialConditions: SpecialCondition[];
  public player: Player;
  public source: Card;
  public target: PokemonCardList;

  constructor(player: Player, source: Card, target: PokemonCardList, specialConditions: SpecialCondition[], poisonDamage: number = 10, burnDamage: number = 20, sleepFlips: number = 1) {
    this.player = player;
    this.source = source;
    this.target = target;
    this.specialConditions = specialConditions;
    this.poisonDamage = poisonDamage;
    this.burnDamage = burnDamage;
    this.sleepFlips = sleepFlips;
  }
}

export class CheckPrizesDestinationEffect implements Effect {
  readonly type: string = CheckEffects.CHECK_PRIZES_DESTINATION_EFFECT;
  public preventDefault = false;
  public player: Player;
  public destination: CardList;

  constructor(player: Player, destination: CardList) {
    this.player = player;
    this.destination = destination;
  }
}
