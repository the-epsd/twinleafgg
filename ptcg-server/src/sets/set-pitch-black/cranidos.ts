import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON } from '../../game/store/prefabs/prefabs';

export class Cranidos extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Antique Skull Fossil';
  public cardType: CardType = F;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Fling Off',
      cost: [F, F],
      damage: 70,
      text: 'Your opponent switches their Active Pokémon with 1 of their Benched Pokémon.',
    },
  ];

  public set: string = 'M5';
  public setNumber: string = '42';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cranidos';
  public fullName: string = 'Cranidos M5';

  private usedFlingOff = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        this.usedFlingOff = true;
      }
    }
    if (effect instanceof AfterAttackEffect && this.usedFlingOff && effect.attack === this.attacks[0]) {
      this.usedFlingOff = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        return OPPONENT_SWITCHES_THEIR_ACTIVE_POKEMON(store, state, player);
      }
    }
    if (effect instanceof EndTurnEffect) {
      this.usedFlingOff = false;
    }
    return state;
  }
}
