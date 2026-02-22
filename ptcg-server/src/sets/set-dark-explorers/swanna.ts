import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, FLIP_UNTIL_TAILS_AND_COUNT_HEADS } from '../../game/store/prefabs/prefabs';

export class Swanna extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Ducklett';
  public cardType: CardType = W;
  public hp: number = 90;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Healing Dance',
      cost: [W],
      damage: 0,
      text: 'Heal 30 damage from each of your Pokémon.'
    },
    {
      name: 'Incessant Peck',
      cost: [W, W, C],
      damage: 60,
      damageCalculation: '+',
      text: 'Flip a coin until you get tails. This attack does 20 more damage for each heads.'
    }
  ];

  public set: string = 'DEX';
  public setNumber: string = '36';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Swanna';
  public fullName: string = 'Swanna DEX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Healing Dance - heal 30 from each of your Pokémon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        store.reduceEffect(state, healEffect);
      });
    }

    // Incessant Peck - flip until tails, +20 for each heads
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return FLIP_UNTIL_TAILS_AND_COUNT_HEADS(store, state, effect.player, headsCount => {
        effect.damage += 20 * headsCount;
      });
    }

    return state;
  }
}
