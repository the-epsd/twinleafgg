import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Lapras extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 100;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Cleanse Away',
      cost: [W, C],
      damage: 0,
      text: 'Heal 30 damage from each of your Benched Pokémon.'
    },
    {
      name: 'Surf',
      cost: [W, C, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'PLB';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lapras';
  public fullName: string = 'Lapras PLB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      player.bench.forEach(benched => {
        if (benched.cards.length > 0) {
          const healEffect = new HealEffect(player, benched, 30);
          store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}
