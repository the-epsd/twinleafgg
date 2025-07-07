import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_POISON_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Grimer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Pound',
    cost: [C],
    damage: 10,
    text: '',
  },
  {
    name: 'Poison Spurt',
    cost: [G],
    damage: 0,
    text: 'Discard a [G] Energy card attached to Grimer. The Defending Pokémon is now Poisoned.',
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Grimer';
  public fullName: string = 'Grimer DR';

  public usedPoisonSpurt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.GRASS);
      this.usedPoisonSpurt = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedPoisonSpurt === true) {
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
    }

    if (effect instanceof EndTurnEffect && this.usedPoisonSpurt) {
      this.usedPoisonSpurt = false;
    }

    return state;
  }
}