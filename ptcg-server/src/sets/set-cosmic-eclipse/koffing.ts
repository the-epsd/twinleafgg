import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Koffing extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Blow-Away Bomb',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you discard this Pokémon with the effect of Roxie, you may put 1 damage counter on each of your opponent\'s Pokémon. (Place damage counters after the effect of Roxie.)'
  }];

  public attacks = [{
    name: 'Poison Gas',
    cost: [P, C],
    damage: 10,
    text: 'Your opponent\'s Active Pokémon is now Poisoned.'
  }];

  public set: string = 'CEC';
  public name: string = 'Koffing';
  public fullName: string = 'Koffing CEC';
  public setNumber: string = '76';
  public cardImage: string = 'assets/cardback.png';

  public usedPoisonGas = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Blow-Away Bomb is handled in Roxie. 
    // It shouldn't be, so if you can figure out how to get it to be contained in Koffing and Weezing themselves, please do so.

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedPoisonGas = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedPoisonGas === true) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (effect instanceof EndTurnEffect && this.usedPoisonGas) {
      this.usedPoisonGas = false;
    }

    return state;
  }
}