import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  DENY_PRIZES_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN,
} from '../../../game/store/prefabs/prefabs';

export class Togedemaru extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Toge Dash',
      cost: [L],
      damage: 10,
      text: 'Flip a coin. If heads, during your opponent\'s next turn, if this Pokémon is Knocked Out, your opponent can\'t take any Prize cards for it.'
    }
  ];

  public regulationMark: string = 'F';
  public set: string = 'SIT';
  public setNumber: string = '127';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Togedemaru';
  public fullName: string = 'Togedemaru SIT 127';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DENY_PRIZES_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
