import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Servine extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snivy';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Wrap',
      cost: [C],
      damage: 20,
      text: 'Flip a coin. If heads, the Defending Pokemon is now Paralyzed.'
    },
    {
      name: 'Tackle',
      cost: [G, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Servine';
  public fullName: string = 'Servine BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }
    return state;
  }
}
