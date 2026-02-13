import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

export class Serperior extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Servine';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [];

  public attacks = [
    {
      name: 'Vine Whip',
      cost: [C, C],
      damage: 40,
      text: ''
    },
    {
      name: 'Leaf Storm',
      cost: [G, G],
      damage: 60,
      text: 'Heal 20 damage from each of your Grass Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Serperior';
  public fullName: string = 'Serperior BLW 5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Heal 20 damage from each of your Grass Pokémon
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.cardType === CardType.GRASS) {
          const healEffect = new HealTargetEffect(effect, 20);
          healEffect.target = cardList;
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
