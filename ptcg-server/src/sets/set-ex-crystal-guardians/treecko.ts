import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Treecko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Paralyzing Gaze',
      cost: [C],
      damage: 0,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 20,
      text: ''
    }
  ];

  public set: string = 'CG';
  public name: string = 'Treecko';
  public fullName: string = 'Treecko CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '67';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, player, this);
        }
      });
    }

    return state;
  }

}