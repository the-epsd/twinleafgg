import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Gothitelle extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gothorita';
  public cardType: CardType = P;
  public hp: number = 130;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Doom Decree',
      cost: [P, C],
      damage: 0,
      text: 'Flip 2 coins. If both of them are heads, the Defending Pokemon is Knocked Out.'
    },
    {
      name: 'Black Magic',
      cost: [P, C, C],
      damage: 40,
      damageCalculation: '+' as const,
      text: 'Does 20 more damage for each of your opponent\'s Benched Pokemon.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gothitelle';
  public fullName: string = 'Gothitelle DRX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Doom Decree - Flip 2 coins, if both heads KO defending
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        if (results.every(r => r)) {
          // Both heads - KO the defending Pokemon
          const knockOutEffect = new KnockOutEffect(player, opponent.active);
          store.reduceEffect(state, knockOutEffect);
        }
      });
    }

    // Attack 2: Black Magic - +20 per opponent's benched
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const benchedCount = opponent.bench.filter(b => b.cards.length > 0).length;
      effect.damage += benchedCount * 20;
    }

    return state;
  }
}
