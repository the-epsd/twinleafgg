import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Vigoroth extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Slakoth';
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public usedRoar = false;

  public attacks = [
    {
      name: 'Roar',
      cost: [C],
      damage: 0,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.'
    },
    {
      name: 'Slash',
      cost: [C, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '169';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vigoroth';
  public fullName: string = 'Vigoroth UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Roar
    // Ref: AGENTS-patterns.md (post-damage switching - opponent switches)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedRoar = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedRoar) {
      this.usedRoar = false;
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedRoar = false;
    }

    return state;
  }
}
