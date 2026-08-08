import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  WAS_ATTACK_USED,
  COIN_FLIP_PROMPT,
  DEFENDING_POKEMON_CANNOT_ATTACK,
} from '../../../game/store/prefabs/prefabs';

export class Nickit extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Tail Whip',
    cost: [D],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, the Defending Pokémon can\'t attack.'
  }];

  public regulationMark: string = 'D';

  public set: string = 'DAA';
  public setNumber: string = '112';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Nickit';
  public fullName: string = 'Nickit DAA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
