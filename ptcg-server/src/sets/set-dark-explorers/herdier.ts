import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Herdier extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lillipup';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Roar',
      cost: [C],
      damage: 0,
      text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon.'
    },
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '87';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Herdier';
  public fullName: string = 'Herdier DEX';

  public usedRoar = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Roar - set flag for post-damage switch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedRoar = true;
    }

    // Switch opponent's Pokémon after attack
    if (effect instanceof AfterAttackEffect && this.usedRoar) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      this.usedRoar = false;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    // Clean up flag at end of turn
    if (effect instanceof EndTurnEffect && this.usedRoar) {
      this.usedRoar = false;
    }

    return state;
  }
}
