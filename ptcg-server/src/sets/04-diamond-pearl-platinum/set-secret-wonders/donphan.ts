import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterAttackEffect, EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Donphan extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Phanpy';
  public hp: number = 100;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W, value: +20 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rapid Spin',
    cost: [F, C],
    damage: 40,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon, if any. You switch Donphan with 1 of your Benched Pokémon, if any.'
  },
  {
    name: 'Bash In',
    cost: [F, F, C, C],
    damage: 70,
    damageCalculation: '+',
    text: 'If the Defending Pokémon has a Pokémon Tool card attached to it, this attack does 70 damage plus 60 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';
  public name: string = 'Donphan';
  public fullName: string = 'Donphan SW';

  public usedRapidSpin = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rapid Spin
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedRapidSpin = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedRapidSpin) {
      this.usedRapidSpin = false;
      const player = effect.player;
      const opponent = effect.opponent;
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
      if (player.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    if (effect instanceof EndTurnEffect) {
      this.usedRapidSpin = false;
    }

    // Bash In
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.tools.length > 0) {
        effect.damage += 60;
      }
    }

    return state;
  }
}
