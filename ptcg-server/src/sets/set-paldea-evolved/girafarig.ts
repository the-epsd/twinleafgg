import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {StoreLike,State} from '../../game';
import {Effect} from '../../game/store/effects/effect';
import {ADD_PARALYZED_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class Girafarig extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Psy Bolt',
      cost: [C, C],
      damage: 30,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Headbang',
      cost: [C, C, C],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'PAL';
  public regulationMark: string = 'G';
  public setNumber: string = '154';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Girafarig';
  public fullName: string = 'Girafarig PAL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Psy Bolt
    if (WAS_ATTACK_USED(effect, 0, this)){
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) { ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this); }
      });
    }

    return state;
  }

}