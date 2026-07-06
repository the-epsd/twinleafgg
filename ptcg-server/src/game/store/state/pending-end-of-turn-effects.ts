import { Attack } from '../card/pokemon-types';
import { SpecialCondition } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { PokemonCardList } from './pokemon-card-list';

export interface PendingEndOfTurnEffectBase {
  target: PokemonCardList;
  attack: Attack;
  sourceCard: PokemonCard;
  attackerPlayerId: number;
}

export interface PendingEndOfTurnKnockOut extends PendingEndOfTurnEffectBase {
  type: 'knock_out';
}

export interface PendingEndOfTurnDiscard extends PendingEndOfTurnEffectBase {
  type: 'discard';
}

export interface PendingEndOfTurnDamageCounters extends PendingEndOfTurnEffectBase {
  type: 'damage_counters';
  damage: number;
}

export interface PendingEndOfTurnSpecialCondition extends PendingEndOfTurnEffectBase {
  type: 'special_condition';
  specialCondition: SpecialCondition;
}

export type PendingEndOfTurnEffect =
  | PendingEndOfTurnKnockOut
  | PendingEndOfTurnDiscard
  | PendingEndOfTurnDamageCounters
  | PendingEndOfTurnSpecialCondition;
