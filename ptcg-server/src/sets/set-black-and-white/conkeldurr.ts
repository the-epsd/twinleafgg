import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Conkeldurr extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gurdurr';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: P }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Stone Edge',
      cost: [F, F, C],
      damage: 80,
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
    {
      name: 'Swing Around',
      cost: [F, F, C, C],
      damage: 100,
      text: 'Does 40 damage to each Benched Pokemon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '61';
  public name: string = 'Conkeldurr';
  public fullName: string = 'Conkeldurr BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          (effect as AttackEffect).damage = 0;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Damage all opponent's benched Pokemon
      opponent.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });

      // Damage all your own benched Pokemon
      player.bench.forEach(benchSlot => {
        if (benchSlot.cards.length > 0) {
          const damageEffect = new PutDamageEffect(effect, 40);
          damageEffect.target = benchSlot;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
