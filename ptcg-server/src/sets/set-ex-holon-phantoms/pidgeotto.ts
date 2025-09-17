import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Pidgeotto extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pidgey';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Whirlwind',
    cost: [L, C],
    damage: 30,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.',
  }];

  public set: string = 'HP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '49';
  public name: string = 'Pidgeotto';
  public fullName: string = 'Pidgeotto HP';

  public usedWhirlwind = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedWhirlwind = true;
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