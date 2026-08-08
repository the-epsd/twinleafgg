import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import {
  COIN_FLIP_PROMPT,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
} from '../../../game/store/prefabs/prefabs';

export class CynthiasFeebas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.CYNTHIAS];
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Undulate',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
  }];

  public regulationMark = 'I';

  public set: string = 'DRI';
  public setNumber: string = '52';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Cynthia\'s Feebas';
  public fullName: string = 'Cynthia\'s Feebas DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    return state;
  }
}
