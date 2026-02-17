import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND } from '../../game/store/prefabs/prefabs';

export class Axew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 40;
  public weakness = [{ type: N }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Signs of Evolution',
      cost: [F],
      damage: 0,
      text: 'Flip a coin. If heads, search your deck for Fraxure, reveal it, and put it into your hand. Shuffle your deck afterward.'
    },
    {
      name: 'Scratch',
      cost: [M],
      damage: 10,
      text: ''
    }
  ];

  public set: string = 'DRV';
  public setNumber: string = '12';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Axew';
  public fullName: string = 'Axew DRV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Signs of Evolution - flip heads to search for Fraxure
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(store, state, player, { name: 'Fraxure' }, { min: 0, max: 1 });
        }
      });
    }

    return state;
  }
}
