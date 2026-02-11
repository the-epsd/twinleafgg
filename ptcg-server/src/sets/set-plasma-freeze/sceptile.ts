import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { EnergyCard } from '../../game/store/card/energy-card';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE } from '../../game/store/prefabs/attack-effects';

export class Sceptile extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Grovyle';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'X-Scissor',
      cost: [G, C],
      damage: 30,
      damageCalculation: '+' as '+',
      text: 'Flip a coin. If heads, this attack does 40 more damage.'
    },
    {
      name: 'Energy Bloom',
      cost: [G, G, C],
      damage: 80,
      text: 'Heal 20 damage from each of your Pokémon that has any Energy attached to it.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '8';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sceptile';
  public fullName: string = 'Sceptile PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      FLIP_A_COIN_IF_HEADS_DEAL_MORE_DAMAGE(store, state, effect, 40);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        const hasEnergy = cardList.cards.some(c => c instanceof EnergyCard);
        if (hasEnergy && cardList.damage > 0) {
          const healEffect = new HealEffect(player, cardList, 20);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
