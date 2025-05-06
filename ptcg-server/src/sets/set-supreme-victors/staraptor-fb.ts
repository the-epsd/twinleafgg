import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class StaraptorFB extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Quick Attack',
      cost: [C],
      damage: 10,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 damage plus 10 more damage.',
    },
    {
      name: 'Whirlwind',
      cost: [C, C, C],
      damage: 30,
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
    }];

  public set: string = 'SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Staraptor FB';
  public fullName: string = 'Staraptor FB SV';

  public usedWhirlwind = false

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 10);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedWhirlwind = true
    }

    if (effect instanceof AfterAttackEffect && this.usedWhirlwind === true) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    if (effect instanceof EndTurnEffect && this.usedWhirlwind) {
      this.usedWhirlwind = false;
    }

    return state;
  }
}