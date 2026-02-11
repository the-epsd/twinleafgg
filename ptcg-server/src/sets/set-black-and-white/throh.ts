import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Throh extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Circle Throw',
      cost: [F, C, C],
      damage: 60,
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Throh';
  public fullName: string = 'Throh BLW';

  public usedCircleThrow = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Circle Throw - set flag for post-damage switch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedCircleThrow = true;
    }

    // Switch opponent's Pokémon after damage
    if (effect instanceof AfterAttackEffect && this.usedCircleThrow) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      this.usedCircleThrow = false;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedCircleThrow) {
      this.usedCircleThrow = false;
    }

    return state;
  }
}
