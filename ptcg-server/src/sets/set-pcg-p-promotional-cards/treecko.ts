import { ADD_SLEEP_TO_PLAYER_ACTIVE, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export class Treecko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Tail Shake',
      cost: [G],
      damage: 0,
      text: 'The Defending Pokémon is now Asleep.'
    },
    {
      name: 'Slash',
      cost: [C, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PCGP';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Treecko';
  public fullName: string = 'Treecko PCGP 37';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
    }

    return state;
  }
}