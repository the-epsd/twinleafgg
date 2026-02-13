import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { HealEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Dragonair2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Dratini';
  public cardType: CardType = N;
  public hp: number = 70;
  public weakness = [{ type: N }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Healing Melody',
      cost: [G],
      damage: 0,
      text: 'Heal 10 damage from each of your Pok\u00e9mon.'
    },
    {
      name: 'Slam',
      cost: [L, C],
      damage: 30,
      damageCalculation: 'x' as const,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '4';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dragonair';
  public fullName: string = 'Dragonair DRV 4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Melody - Heal 10 from each of your Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 10);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    // Slam - Flip 2 coins, 30x heads
    if (WAS_ATTACK_USED(effect, 1, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 2, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 30 * heads;
      });
    }

    return state;
  }
}
