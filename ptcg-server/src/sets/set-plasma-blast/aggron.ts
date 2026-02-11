import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Aggron extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Lairon';
  public cardType: CardType = M;
  public hp: number = 140;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Knock Back',
      cost: [M, C],
      damage: 50,
      text: 'Your opponent switches the Defending Pok\u00e9mon with 1 of his or her Benched Pok\u00e9mon.'
    },
    {
      name: 'Aura of the Land',
      cost: [M, M, C, C],
      damage: 80,
      text: 'Does 20 damage to each Benched Pok\u00e9mon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pok\u00e9mon.)'
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '59';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Aggron';
  public fullName: string = 'Aggron PLB';

  public usedKnockBack = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      this.usedKnockBack = true;
    }

    if (effect instanceof AfterAttackEffect && this.usedKnockBack) {
      this.usedKnockBack = false;
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
      }
    }

    if (effect instanceof EndTurnEffect && this.usedKnockBack) {
      this.usedKnockBack = false;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Damage opponent's bench
      opponent.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });

      // Damage player's bench
      player.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const damage = new PutDamageEffect(effect, 20);
          damage.target = benched;
          store.reduceEffect(state, damage);
        }
      });
    }

    return state;
  }
}
