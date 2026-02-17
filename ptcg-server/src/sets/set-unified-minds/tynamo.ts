import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Tynamo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 30;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public usedWildRiver = false;

  public attacks = [
    {
      name: 'Wild River',
      cost: [C],
      damage: 0,
      text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Tynamo';
  public fullName: string = 'Tynamo UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Wild River
    // Ref: AGENTS-patterns.md (post-damage switching)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedWildRiver = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedWildRiver) {
      this.usedWildRiver = false;
      SWITCH_ACTIVE_WITH_BENCHED(store, state, effect.player);
    }

    if (effect instanceof EndTurnEffect) {
      this.usedWildRiver = false;
    }

    return state;
  }
}
