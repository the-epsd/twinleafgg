import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Deino extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType = D;
  public hp: number = 80;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Body Slam',
      cost: [C, C],
      damage: 20,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Darkness Fang',
      cost: [D, C, C],
      damage: 50,
      text: ''
    }
  ];

  public set: string = 'WHT';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Deino';
  public fullName: string = 'Deino SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      return COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.player, this);
        }
      });
    }
    return state;
  }
}

