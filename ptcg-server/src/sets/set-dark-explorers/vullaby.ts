import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Vullaby extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Whirlwind',
      cost: [D],
      damage: 10,
      text: 'Your opponent switches the Defending Pokemon with 1 of his or her Benched Pokémon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Vullaby';
  public fullName: string = 'Vullaby DEX';

  public usedWhirlwind = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedWhirlwind = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedWhirlwind) {
      this.usedWhirlwind = false;
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    if (effect instanceof EndTurnEffect && this.usedWhirlwind) {
      this.usedWhirlwind = false;
    }

    return state;
  }
}
