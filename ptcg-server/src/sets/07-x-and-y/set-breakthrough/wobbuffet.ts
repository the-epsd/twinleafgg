import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Wobbuffet extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 100;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Mirror Barrier',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all damage done to this Pokémon by attacks during your opponent\'s next turn.'
  }, {
    name: 'Rolling Tackle',
    cost: [P, P, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'BKT';
  public setNumber: string = '67';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wobbuffet';
  public fullName: string = 'Wobbuffet BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
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
