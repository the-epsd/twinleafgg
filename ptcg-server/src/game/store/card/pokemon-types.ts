import { CardType } from './card-types';
import { StoreLike } from '../store-like';
import { State } from '../state/state';
import { AttackEffect, PowerEffect } from '../effects/game-effects';

export interface Weakness {
  type: CardType;
  value?: number; // when undefined, then it's x2
}

export interface Resistance {
  type: CardType;
  value: number;
}

export interface Attack {
  cost: CardType[];
  damage: number;
  damageCalculation?: string;
  copycatAttack?: boolean;
  gxAttack?: boolean;
  shredAttack?: boolean;
  useOnBench?: boolean;
  name: string;
  text: string;
  effect?: (store: StoreLike, state: State, effect: AttackEffect) => void;
}

export enum PowerType {
  POKEBODY,
  POKEPOWER,
  ABILITY,
  ANCIENT_TRAIT
}

export interface Power {
  name: string;
  powerType: PowerType;
  text: string;
  effect?: (store: StoreLike, state: State, effect: PowerEffect) => State;
  useWhenInPlay?: boolean;
  useFromHand?: boolean;
  useFromDiscard?: boolean;
  exemptFromAbilityLock?: boolean;
  exemptFromInitialize?: boolean;
  barrage?: boolean;
}
