import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../../game/store/prefabs/prefabs';

export class Reuniclus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Duosion';
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Barrier Attack',
    cost: [P],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to this Pokémon by attacks is reduced by 30 (after applying Weakness and Resistance).'
  },
  {
    name: 'Telekinesis of Nobility',
    cost: [P, C, C],
    damage: 70,
    text: 'Switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'PLB';
  public setNumber: string = '44';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Reuniclus';
  public fullName: string = 'Reuniclus PLB';

  public usedTelekinesis = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Barrier Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damageReductionNextTurn = 30;
    }

    // Telekinesis of Nobility
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedTelekinesis = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedTelekinesis) {
      this.usedTelekinesis = false;
      const player = effect.player;
      if (player.bench.some(b => b.cards.length > 0)) {
        state = SWITCH_ACTIVE_WITH_BENCHED(store, state, player) || state;
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedTelekinesis = false;
    }

    return state;
  }
}
