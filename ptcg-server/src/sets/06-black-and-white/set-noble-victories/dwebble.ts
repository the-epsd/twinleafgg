import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Dwebble extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [G];
  public hp: number = 60;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Withdraw',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
  }, {
    name: 'Slash',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'NVI';
  public setNumber: string = '6';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dwebble';
  public fullName: string = 'Dwebble NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Withdraw
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
