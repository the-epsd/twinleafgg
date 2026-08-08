import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, PREVENT_DAMAGE } from '../../../game/store/prefabs/prefabs';

export class Bidoof extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Gnaw',
    cost: [C],
    damage: 10,
    text: ''
  }, {
    name: 'Scrunch',
    cost: [C, C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
  }];

  public set: string = 'PRC';
  public setNumber: string = '116';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Bidoof';
  public fullName: string = 'Bidoof PRC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Scrunch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
