import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Cobalion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 110;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Metal Horns',
      cost: [M, C],
      damage: 30,
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    },
    {
      name: 'Sacred Sword',
      cost: [M, M, C],
      damage: 100,
      text: 'This Pokémon can\'t use Sacred Sword during your next turn.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '77';
  public name: string = 'Cobalion';
  public fullName: string = 'Cobalion EPO';

  public usedMetalHorns = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Metal Horns - set flag when attack is used
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedMetalHorns = true;
    }

    // Metal Horns - switch after damage is dealt
    if (effect instanceof AfterAttackEffect && this.usedMetalHorns) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    // Clean up Metal Horns flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedMetalHorns) {
      this.usedMetalHorns = false;
    }

    // Sacred Sword - simplified "can't use next turn" pattern
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Sacred Sword')) {
        player.active.cannotUseAttacksNextTurnPending.push('Sacred Sword');
      }
    }

    return state;
  }
}
