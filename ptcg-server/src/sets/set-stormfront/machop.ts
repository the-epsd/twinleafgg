import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Machop extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 60;
  public weakness = [{ type: P, value: 10 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Kick',
      cost: [C],
      damage: 10,
      text: '',
    },
    {
      name: 'Knock Back',
      cost: [F, C],
      damage: 20,
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
    }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '64';
  public name: string = 'Machop';
  public fullName: string = 'Machop SF';

  public usedKnockBack = false

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedKnockBack = true
    }

    if (effect instanceof AfterAttackEffect && this.usedKnockBack === true) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    if (effect instanceof EndTurnEffect && this.usedKnockBack) {
      this.usedKnockBack = false;
    }

    return state;
  }
}