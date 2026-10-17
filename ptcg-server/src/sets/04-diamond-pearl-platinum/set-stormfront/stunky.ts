import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MULTIPLE_COIN_FLIPS_PROMPT, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';

export class Stunky extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +10 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gnaw and Run',
    cost: [D],
    damage: 10,
    text: 'Switch Stunky with 1 of your Benched Pokémon.'
  },
  {
    name: 'Double Scratch',
    cost: [C, C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 20 damage times the number of heads.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Stunky';
  public fullName: string = 'Stunky SF';

  public usedSwitchAttack0 = false;
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gnaw and Run
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSwitchAttack0 = true;
    }

    // Double Scratch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        effect.damage = 20 * results.filter(r => r).length;
      });
    }

    if (effect instanceof AfterAttackEffect && this.usedSwitchAttack0) {
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }
    if (effect instanceof EndTurnEffect) {
      this.usedSwitchAttack0 = false;
    }
    return state;
  }
}
