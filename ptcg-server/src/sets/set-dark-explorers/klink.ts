import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect, EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Klink extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 60;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Smash Turn',
      cost: [C, C],
      damage: 20,
      text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '75';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Klink';
  public fullName: string = 'Klink DEX';

  private usedSmashTurn: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smash Turn - mark for switching after attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedSmashTurn = true;
    }

    // After Smash Turn attack, switch self with benched
    if (effect instanceof AfterAttackEffect && this.usedSmashTurn) {
      this.usedSmashTurn = false;
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect && this.usedSmashTurn) {
      this.usedSmashTurn = false;
    }

    return state;
  }
}
